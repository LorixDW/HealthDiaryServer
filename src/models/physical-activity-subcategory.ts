import { PhysicalActivityCategory, PhysicalActivityCategoryResponse } from './physical-activity-category';
import { Column, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { RecordPhysicalActivity } from './record-physical-activity';

@Entity()
export class PhysicalActivitySubcategory {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({type: 'text'})
  name: string;

  @Column({type: 'text', nullable: true})
  description: string | null;

  @Column({type: 'real', default: 0})
  met: number

  @ManyToOne(
    () => PhysicalActivityCategory,
    (category) => category.subcategories
  )
  category: PhysicalActivityCategory;

  @OneToMany(
    () => RecordPhysicalActivity,
    (physicalActivity) => physicalActivity.subcategory
  )
  physicalActivities: RecordPhysicalActivity[];

  public toResponse(): PhysicalActivitySubcategoryResponse{
    const response = new PhysicalActivitySubcategoryResponse()
    response.id = this.id
    response.name = this.name
    response.description = this.description
    response.met = this.met
    response.category = this.category.toResponse()
    return response
  }
}

export class PhysicalActivitySubcategoryResponse{
  id: number
  name: string
  description: string | null
  met: number
  category: PhysicalActivityCategoryResponse
}