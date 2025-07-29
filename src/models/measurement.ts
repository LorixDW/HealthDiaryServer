import { Record } from './record';
import { Column, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn, ValueTransformer } from 'typeorm';
import { MeasurementIndicator, MeasurementIndicatorResponse } from './measurement-indicator';
import { Time } from '../measurement/dto/add-measurement.body';

const timeTransformer: ValueTransformer = {
  to: (value: Date): string => {
    return value.toTimeString().slice(0, 8);
  },
  from(value: string | null): Date {
    if(!value) return new Date()
    const [hours, minutes, seconds] = value.split(':').map(Number);
    const date = new Date();
    date.setHours(hours, minutes, seconds, 0);
    return date;
  }
}

@Entity()
export class Measurement {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({type: 'time', transformer: timeTransformer})
  time: Date;

  @ManyToOne(
    () => Record,
    (record) => record.measurements
  )
  record: Record;

  @OneToMany(
    () => MeasurementIndicator,
    (measurementIndicator) => measurementIndicator.measurement,
    {cascade: true}
  )
  measurementIndicators: MeasurementIndicator[]

  constructor(
   time: Date,
   record: Record,
   indicators: MeasurementIndicator[]
  ) {
    this.time = time;
    this.record = record;
    this.measurementIndicators = indicators;
  }

  toResponse(): MeasurementResponse{
    const response = new MeasurementResponse()
    response.id = this.id
    response.time = new Time()
    response.time.hours = this.time.getHours()
    response.time.minutes = this.time.getMinutes()
    response.measurementIndicators = this.measurementIndicators.map((e) => e.toResponse())
    return response
  }
}

export class MeasurementResponse{
  id: number
  time: Time
  measurementIndicators: MeasurementIndicatorResponse[]
}