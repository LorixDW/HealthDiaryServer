import { Meal } from './meal';
import { Dish } from './dish';
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Serving, ServingResponse } from './serving';

@Entity()
export class MealDish{
  @PrimaryGeneratedColumn({type: 'bigint'})
  id: number;

  @Column({type: 'real'})
  count: number;

  @ManyToOne(
    () => Meal,
    (meal) => meal.mealDishes,
    {onDelete: 'CASCADE'}
  )
  meal: Meal;

  @ManyToOne(
    () => Serving,
    (serving) => serving.mealDishes,
    {onDelete: 'CASCADE'}
  )
  serving: Serving;

  constructor(
    count: number,
    meal: Meal,
    serving: Serving
  ) {
    this.count = count
    this.meal = meal
    this.serving = serving
  }

  public toResponse(): MealDishResponse{
    const response = new MealDishResponse()
    response.id = Number(this.id)
    response.serving = this.serving.toResponse()
    response.count = this.count
    return response
  }
}

export class MealDishResponse{
  id: number
  serving: ServingResponse
  count: number
}