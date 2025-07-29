import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { Indicator } from '../models/indicator';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class IndicatorService{
  constructor(
    @InjectRepository(Indicator)
    private indicatorRepository: Repository<Indicator>
  ) {}

  async getAll(): Promise<Indicator[]>{
    return this.indicatorRepository.find();
  }

  async getById(id: number): Promise<Indicator>{
    const res = this.indicatorRepository.findOne({
      where: {
        id: id
      }
    })
    if(res == null){
      throw new HttpException('There is no indicator with such id', HttpStatus.NOT_FOUND);
    }
    return res;
  }
}