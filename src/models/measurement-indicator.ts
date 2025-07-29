import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Measurement } from './measurement';
import { Indicator, IndicatorResponse } from './indicator';

@Entity()
export class MeasurementIndicator {
  @PrimaryGeneratedColumn({type: 'bigint'})
  id: number

  @ManyToOne(
    () => Measurement,
    (measurement) => measurement.measurementIndicators,
    {onDelete: 'CASCADE'}
  )
  measurement: Measurement;

  @ManyToOne(
    () => Indicator,
    (indicator) => indicator.measurementIndicators,
    {onDelete: 'CASCADE'}
  )
  indicator: Indicator;

  @Column({type: 'real'})
  value: number;

  constructor(measurement: Measurement, indicator: Indicator, value: number) {
    this.measurement = measurement;
    this.indicator = indicator;
    this.value = value;
  }

  toResponse(): MeasurementIndicatorResponse{
    const response = new MeasurementIndicatorResponse()
    response.id = Number(this.id)
    response.indicator = this.indicator.toResponse()
    response.value = this.value
    return response
  }
}

export class MeasurementIndicatorResponse{
  id: number;
  indicator: IndicatorResponse;
  value: number;
}