import { MealTime, MealTimeResponse } from './meal-time';
import { Record } from './record';
import { Column, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn, ValueTransformer } from 'typeorm';
import { MealDish, MealDishResponse } from './meal-dish';
import { Time } from '../meal/dto/add-meal.body';

const timeTransformer: ValueTransformer = {
  to: (value: Date | null): string | null => {
    if(!value) return null
    return value.toTimeString().slice(0, 8);
  },
  from(value: string | null): Date | null {
    if(!value) return null
    const [hours, minutes, seconds] = value.split(':').map(Number);
    const date = new Date();
    date.setHours(hours, minutes, seconds, 0);
    return date;
  }
}

@Entity()
export class Meal{
  @PrimaryGeneratedColumn({type: 'bigint'})
  id: number;

  @Column({type: 'time', nullable: true, transformer: timeTransformer})
  time: Date | null;

  @Column({type: 'text', nullable: true})
  note: string | null;

  @ManyToOne(
    () => MealTime,
    (mealTime) => mealTime.meals,
    {nullable: true, onDelete: 'CASCADE'}
  )
  mealTime: MealTime | null;

  @ManyToOne(
    () => Record,
    (record) => record.meals
  )
  record: Record;

  @OneToMany(
    () => MealDish,
    (mealDish) => mealDish.meal
  )
  mealDishes: MealDish[];

  constructor(
    time: Date | null,
    note: string | null,
    mealTime: MealTime | null,
    record: Record
  ) {
    this.time = time
    this.mealTime = mealTime
    this.note = note
    this.record = record
  }

  public toResponse(): MealResponse{
    const response = new MealResponse()
    response.id = Number(this.id)
    response.time = this.time != null ? new Time() : null
    if(response.time != null){
      response.time.hours = this.time.getHours()
      response.time.minutes = this.time.getMinutes()
    }
    response.mealtime = this.mealTime.toResponse()
    response.note = this.note
    if(this.mealDishes != null){
      for(const dish of this.mealDishes){
        const k = dish.count
        response.totalCalories += dish.serving.calories * k
        response.totalProteins += dish.serving.protein * k
        response.totalCarbohydrates += dish.serving.carbohydrate * k
        response.totalFats += dish.serving.fat * k
      }
    }
    return response
  }

  public toFullResponse(): MealFullResponse{
    const response = new MealFullResponse()
    response.id = Number(this.id)
    response.time = this.time != null ? new Time() : null
    if(response.time != null){
      response.time.hours = this.time.getHours()
      response.time.minutes = this.time.getMinutes()
    }
    response.mealtime = this.mealTime.toResponse()
    response.note = this.note
    if(this.mealDishes != null){
      for(const dish of this.mealDishes){
        const k = dish.count
        response.totalCalories += dish.serving.calories * k
        response.totalProteins += dish.serving.protein * k
        response.totalCarbohydrates += dish.serving.carbohydrate * k
        response.totalFats += dish.serving.fat * k
      }
      response.dishes = this.mealDishes.map((e) => e.toResponse())
    }
    return response
  }
}

export class MealResponse{
  id: number
  time: Time | null
  mealtime: MealTimeResponse | null
  note: string | null
  totalCalories: number = 0
  totalProteins: number = 0
  totalCarbohydrates: number = 0
  totalFats: number = 0
}

export class MealFullResponse{
  id: number
  time: Time | null
  mealtime: MealTimeResponse | null
  note: string | null
  totalCalories: number = 0
  totalProteins: number = 0
  totalCarbohydrates: number = 0
  totalFats: number = 0
  dishes: MealDishResponse[] = []
}