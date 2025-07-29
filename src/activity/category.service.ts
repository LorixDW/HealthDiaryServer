import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { PhysicalActivityCategory } from '../models/physical-activity-category';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class CategoryService{
  constructor(
    @InjectRepository(PhysicalActivityCategory)
    private categoryRepository: Repository<PhysicalActivityCategory>
  ) {}

  async getAll(): Promise<PhysicalActivityCategory[]>{
    return this.categoryRepository.find()
  }

  async getById(id: number): Promise<PhysicalActivityCategory>{
    const category = await this.categoryRepository.findOne({
      where: {
        id: id
      }
    })
    if(category == null){
      throw new HttpException(`There is no physical activity category with id ${id}`, HttpStatus.NOT_FOUND)
    }
    return category;
  }
}