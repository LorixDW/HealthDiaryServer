import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { PhysicalActivitySubcategory } from './physical-activity-subcategory';

@Entity()
export class PhysicalActivityCategory {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({type: 'text'})
  name: string;

  @Column({type: 'text', nullable: true})
  description: string | null;

  @OneToMany(
    () => PhysicalActivitySubcategory,
    (subcategory) => subcategory.category
  )
  subcategories: PhysicalActivitySubcategory[];

  public toResponse(): PhysicalActivityCategoryResponse{
    const response = new PhysicalActivityCategoryResponse()
    response.id = this.id
    response.name = this.name
    response.description = this.description
    return response
  }
}

export class PhysicalActivityCategoryResponse{
  id: number
  name: string
  description: string | null
}