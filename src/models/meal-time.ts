import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Meal } from './meal';

@Entity()
export class MealTime{
  @PrimaryGeneratedColumn()
  id: number;

  @Column({type: 'text'})
  name: string;

  @OneToMany(
    () => Meal,
    (meal) => meal.mealTime
  )
  meals: Meal[];

  public toResponse(): MealTimeResponse{
    const response = new MealTimeResponse()
    response.id = this.id
    response.name = this.name
    return response
  }
}

export class MealTimeResponse{
  id: number
  name: string
}