import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Measurement } from '../models/measurement';
import { Repository } from 'typeorm';
import { MeasurementIndicator } from '../models/measurement-indicator';
import { IndicatorService } from '../indicator/indicator.service';
import { UserService } from '../user/user.service';
import { RecordService } from '../record/record.service';
import { Time } from './dto/add-measurement.body';
import {MeasurementIndicator as MeasurementIndicatorRequest} from './dto/update-measurement.body';
import { validateSync } from 'class-validator';
import useRealTimers = jest.useRealTimers;

@Injectable()
export class MeasurementService{
  constructor(
    @InjectRepository(Measurement)
    private measurementRepository: Repository<Measurement>,
    @InjectRepository(MeasurementIndicator)
    private indicatorRepository: Repository<MeasurementIndicator>,
    private indicatorService: IndicatorService,
    private userService: UserService,
    private recordService: RecordService
  ) {}

  async getAll(record_id: number, user_id): Promise<Measurement[]>{
    const record = await this.recordService.getById(record_id, user_id);
    return this.measurementRepository.find({
      where: {
        record: record
      },
      relations: ['record', 'measurementIndicators', 'measurementIndicators.indicator']
    })
  }

  async getById(id: number, user_id: number): Promise<Measurement>{
    const measurement = await this.measurementRepository.findOne({
      where: {
        id: id
      },
      relations: ['record', 'measurementIndicators', 'record.user', 'measurementIndicators.indicator']
    })
    if(measurement.record.user.id != user_id){
      throw new HttpException('This measurement is not yours', HttpStatus.FORBIDDEN);
    }
    return measurement;
  }

  async add(record_id: number, time: Time, user_id: number){
    const record = await this.recordService.getById(record_id, user_id);
    if(record.isDeleted){
      throw new HttpException('You can not edit deleted records', HttpStatus.FORBIDDEN);
    }
    let measurement = new Measurement(new Date(0, 0, 0, time.hours, time.minutes), record, [])
    measurement = await this.measurementRepository.save(measurement);
    return this.getById(measurement.id, user_id)
  }

  async update(id: number, time: Time, indicators: MeasurementIndicatorRequest[], user_id){
    const measurement = await this.getById(id, user_id);
    const user = await this.userService.getUserById(user_id)
    if(measurement.record.isDeleted){
      throw new HttpException('You can not edit deleted records', HttpStatus.FORBIDDEN);
    }
    await this.measurementRepository.save(measurement);
    for(const indicator of indicators){
      if(indicator.id < 0){
        await this.indicatorRepository.save(new MeasurementIndicator(
          measurement,
          await this.indicatorService.getById(indicator.indicator.id),
          indicator.value
        ))
      }else{
        const measurementIndicator = measurement.measurementIndicators.filter((e) => e.id == indicator.id)
        if(measurementIndicator.length == 0){
          throw new HttpException(`There is no such indicator in this measurement with id ${indicator.id}`, HttpStatus.NOT_FOUND)
        }
        measurementIndicator[0].value = indicator.value;
        measurementIndicator[0].indicator = await this.indicatorService.getById(indicator.indicator.id)
        await this.indicatorRepository.save(measurementIndicator[0])
      }
      if(indicator.indicator.id == 5){
        user.weight = indicator.value
        await this.userService.save(user)
      }
    }
    return this.getById(id, user_id)
  }

  async delete(id: number, user_id: number){
    const measurement = await this.getById(id, user_id);
    try{
      await this.measurementRepository.remove(measurement)
      return;
    }catch (e) {
      throw new HttpException('Something went wrong', HttpStatus.SERVICE_UNAVAILABLE)
    }
  }

  async deleteIndicator(id: number, user_id){
    const user = await this.userService.getUserById(user_id);
    const measurementIndicator = await this.indicatorRepository.findOne({
      where: {
        id: id
      },
      relations: ['measurement', 'measurement.record', 'measurement.record.user']
    })
    if(measurementIndicator == null){
      throw new HttpException('There is no measuremnt indicator with such id', HttpStatus.NOT_FOUND);
    }
    if(measurementIndicator.measurement.record.user.id != user.id){
      throw new HttpException('This record is not yours', HttpStatus.FORBIDDEN);
    }
    if(measurementIndicator.measurement.record.isDeleted){
      throw new HttpException('You can not edit deleted records', HttpStatus.FORBIDDEN);
    }

    try{
      await this.indicatorRepository.remove(measurementIndicator);
      return;
    }catch (e) {
      throw new HttpException('Something went wrong', HttpStatus.SERVICE_UNAVAILABLE)
    }
  }
}