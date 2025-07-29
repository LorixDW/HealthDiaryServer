import { Serving, ServingResponse } from './serving';
import { Column, Entity, ManyToOne, OneToMany, PrimaryColumn, PrimaryGeneratedColumn } from 'typeorm';
import { MealDish } from './meal-dish';

@Entity()
export class Dish{
  @PrimaryColumn()
  id: number
  @Column({type: 'text'})
  name: string
  @Column({type: 'text'})
  page_url: string

  @OneToMany(
    () => Serving,
    (serving) => serving.dish
  )
  servings: Serving[]

  constructor(id: number, name: string, page_url: string, servings: Serving[]) {
    this.id = id
    this.name = name
    this.page_url = page_url
    this.servings = servings
  }

  public toResponse(): DishResponse{
    const response = new DishResponse()
    response.id = this.id
    response.name = this.name
    response.page_url = this.page_url
    return response
  }

  public toFullResponse(): DishFullResponse{
    const response = new DishFullResponse()
    response.id = this.id
    response.name = this.name
    response.page_url = this.page_url
    response.servings = this.servings.map((e) => e.toResponse())
    return response
  }
}

export class DishResponse{
  id: number
  name: string
  page_url: string
}

export class DishFullResponse{
  id: number
  name: string
  page_url: string
  servings: ServingResponse[]
}