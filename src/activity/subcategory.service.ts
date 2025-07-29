import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { PhysicalActivitySubcategory } from '../models/physical-activity-subcategory';
import { PhysicalActivityCategory } from '../models/physical-activity-category';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class SubcategoryService{
  constructor(
    @InjectRepository(PhysicalActivitySubcategory)
    private subcategoryRepository: Repository<PhysicalActivitySubcategory>
  ) {}

  async getAll(): Promise<PhysicalActivitySubcategory[]>{
    return this.subcategoryRepository.find({
      relations: ['category']
    })
  }

  async getById(id: number): Promise<PhysicalActivitySubcategory>{
    const subcategory = await this.subcategoryRepository.findOne({
      where: {
        id: id
      },
      relations: ['category']
    })
    if(subcategory == null){
      throw new HttpException(`There is no physical activity subcategory with id ${id}`, HttpStatus.NOT_FOUND)
    }
    return subcategory;
  }
}