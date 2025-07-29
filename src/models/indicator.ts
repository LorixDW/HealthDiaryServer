import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { MeasurementIndicator } from './measurement-indicator';

@Entity()
export class Indicator {
  @PrimaryGeneratedColumn()
  id: number;
  @Column({type: 'text'})
  name: string;
  @Column({type: 'text', default: ''})
  suffix: string
  @Column({type: 'real', default: 0})
  upperLimit: number
  @Column({type: 'real', default: 0})
  lowerLimit: number

  @OneToMany(
    () => MeasurementIndicator,
    (measurementIndicator) => measurementIndicator.indicator
  )
  measurementIndicators: MeasurementIndicator[]

  public toResponse(): IndicatorResponse{
    const response = new IndicatorResponse();
    response.id = this.id;
    response.name = this.name;
    response.suffix = this.suffix;
    response.upperLimit = this.upperLimit;
    response.lowerLimit = this.lowerLimit
    return response;
  }
}

export class IndicatorResponse{
  id: number
  name: string
  suffix: string
  upperLimit: number
  lowerLimit: number
}