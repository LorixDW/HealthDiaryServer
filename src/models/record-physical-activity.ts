import { Record } from './record';
import { PhysicalActivitySubcategory, PhysicalActivitySubcategoryResponse } from './physical-activity-subcategory';
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class RecordPhysicalActivity {
  @PrimaryGeneratedColumn({type: 'bigint'})
  id: number;

  @ManyToOne(
    () => Record,
    (record) => record.physicalActivities
  )
  record: Record;

  @ManyToOne(
    () => PhysicalActivitySubcategory,
    (subcategory) => subcategory.physicalActivities,
    {onDelete: 'CASCADE'}
  )
  subcategory: PhysicalActivitySubcategory;

  @Column({type: 'int'})
  time: number;

  @Column({type: 'text', nullable: true})
  note: string | null;

  constructor(
    record: Record,
    subcategory: PhysicalActivitySubcategory,
    time: number, note: string | null
  ) {
    this.record = record
    this.subcategory = subcategory
    this.time = time
    this.note = note
  }

  public toResponse(): ActivityResponse{
    const response = new ActivityResponse()
    response.id = Number(this.id)
    response.time = this.time
    response.note = this.note
    response.subcategory = this.subcategory.toResponse()
    return response
  }
}

export class ActivityResponse{
  id: number
  time: number
  note: string | null
  subcategory: PhysicalActivitySubcategoryResponse
}