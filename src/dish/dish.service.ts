import { InjectRepository } from '@nestjs/typeorm';
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { consumer_key, consumer_secret, user_id, user_secret } from './constants';
import { firstValueFrom } from 'rxjs';
import { Dish } from '../models/dish';
import { Repository } from 'typeorm';
import { Serving } from '../models/serving';
import OAuth from 'oauth-1.0a';
import crypto from 'crypto'

@Injectable()
export class DishService{
  constructor(
    private httpService: HttpService,
    @InjectRepository(Dish)
    private dishRepository: Repository<Dish>,
    @InjectRepository(Serving)
    private servingRepository: Repository<Serving>
  ) {}

  private access_token: string | null
  private expiration = new Date()

  async refreshToken(){
    if(new Date(Date.now()) <= this.expiration){
      return;
    }
    const body = new URLSearchParams()
    body.append('grant_type', 'client_credentials')
    body.append('client_id', user_id);
    body.append('client_secret', user_secret);
    body.append('scope', 'basic');

    const response = await firstValueFrom(
      this.httpService.post('https://oauth.fatsecret.com/connect/token', body.toString(), {
        headers:{
          'Content-Type': 'application/x-www-form-urlencoded'
        }
      })
    )
    this.access_token = response.data.access_token
    const expires_in = response.data.expires_in
    this.expiration = new Date(Date.now() + expires_in * 1000)
  }

  async getList(expression: string, max_results: number | null, page_number: number | null): Promise<Dish[]>{
    await this.refreshToken()
    if(max_results == null){
      max_results = 7
    }
    if(page_number == null){
      page_number = 0
    }

    const url = 'https://platform.fatsecret.com/rest/server.api'
    const request_data = {
      data: {
        method: 'foods.search',
        format: 'json',
        search_expression: expression,
        max_results: max_results.toString(),
        page_number: page_number.toString()
      }
    }
    const query = new URLSearchParams({
      ...request_data.data,
    })

    const response = await firstValueFrom(
      this.httpService.get(url, {
        params: query,
        headers: {
          Authorization: `Bearer ${this.access_token}`
        }
      })
    )
    console.log(response.data)
    return response.data.foods.food.map((e) => new Dish(
      Number(e.food_id),
      e.food_name,
      e.food_url,
      []
    ))
  }

  async getById(id: number){
    await this.refreshToken()

    let dish = await this.dishRepository.findOne({
      where: {
        id: id
      },
      relations: ['servings', 'servings.dish']
    })
    if(dish != null) {
      return dish
    }

    const query = new URLSearchParams()
    query.append('method', 'food.get.v4')
    query.append('food_id', id.toString())
    query.append('format', 'json')

    const response = await firstValueFrom(
      this.httpService.get('https://platform.fatsecret.com/rest/server.api', {
        params: query,
        headers: {
          Authorization: `Bearer ${this.access_token}`
        }
      })
    )
    console.log(response.data.food.servings.serving)
    dish = new Dish(
      Number(response.data.food.food_id),
      response.data.food.food_name,
      response.data.food.food_url,
      []
    )
    await this.dishRepository.save(dish)
    dish.servings = response.data.food.servings.serving.map((e) => {
      const serving = new Serving()
      serving.dish = dish
      serving.id = Number(e.serving_id)
      serving.name = e.serving_description
      serving.suffix = e.metric_serving_unit
      serving.amount = Number(e.metric_serving_amount)
      serving.calories = Number(e.calories)
      serving.protein = Number(e.protein)
      serving.fat = Number(e.fat)
      serving.fat_trans = e.trans_fat != null ? Number(e.trans_fat) : null
      serving.fat_saturated = e.saturated_fat != null ? Number(e.saturated_fat) : null
      serving.fat_polyunsaturated = e.polyunsaturated_fat != null ? Number(e.polyunsaturated_fat) : null
      serving.fat_monounsaturated = e.monounsaturated_fat != null ? Number(e.monounsaturated_fat) : null
      serving.carbohydrate = Number(e.carbohydrate)
      serving.fiber = e.fiber != null ? Number(e.fiber) : null
      serving.sugar = e.sugar != null ? Number(e.sugar) : null
      serving.cholesterol = e.cholesterol != null ? Number(e.cholesterol) : null
      serving.sodium = e.sodium != null ? Number(e.sodium) : null
      serving.potassium = e.potassium != null ? Number(e.potassium) : null
      serving.vitamin_c = e.vitamin_c != null ? Number(e.vitamin_c) : null
      serving.vitamin_a = e.vitamin_a != null ? Number(e.vitamin_a) : null
      serving.vitamin_d = e.vitamin_d != null ? Number(e.vitamin_d) : null
      serving.calcium = e.calcium != null ? Number(e.calcium) : null
      serving.iron = e.iron != null ? Number(e.iron) : null
      return serving
    })
    await this.servingRepository.save(dish.servings)
    return dish
  }

  async getServingById(id: number): Promise<Serving>{
    const serving = await this.servingRepository.findOne({
      where: {
        id: id
      },
      relations: ['dish']
    })
    if(serving == null){
      throw new HttpException(`There id no serving with id ${id} in local serving base`, HttpStatus.NOT_FOUND)
    }
    return serving
  }
}