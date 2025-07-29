import { Column, Entity, ManyToOne, OneToMany, PrimaryColumn} from 'typeorm';
import { Dish, DishResponse } from './dish';
import { MealDish } from './meal-dish';

@Entity()
export class Serving{
  @PrimaryColumn()
  id: number

  @Column({type: 'text'})
  name: string

  @Column({type: 'text'})
  suffix: string

  @Column({type: 'real'})
  amount: number

  @Column({type: 'real'})
  calories: number;

  @Column({type: 'real'})
  protein: number;

  @Column({type: 'real'})
  fat: number;

  @Column({type: 'real', nullable: true})
  fat_trans: number | null;

  @Column({type: 'real', nullable: true})
  fat_saturated: number | null;

  @Column({type: 'real', nullable: true})
  fat_monounsaturated: number | null;

  @Column({type: 'real', nullable: true})
  fat_polyunsaturated: number | null;

  @Column({type: 'real'})
  carbohydrate: number;

  @Column({type: 'real', nullable: true})
  fiber: number | null;

  @Column({type: 'real', nullable: true})
  sugar: number | null;

  @Column({type: 'real', nullable: true})
  cholesterol: number | null;

  @Column({type: 'real', nullable: true})
  sodium: number | null;

  @Column({type: 'real', nullable: true})
  potassium: number | null;

  @Column({type: 'real', nullable: true})
  vitamin_c: number | null;

  @Column({type: 'real', nullable: true})
  vitamin_a: number | null;

  @Column({type: 'real', nullable: true})
  vitamin_d: number | null;

  @Column({type: 'real', nullable: true})
  calcium: number | null;

  @Column({type: 'real', nullable: true})
  iron: number | null;

  @ManyToOne(
    () => Dish,
    (dish) => dish.servings,
    {onDelete: 'CASCADE'}
  )
  dish: Dish

  @OneToMany(
    () => MealDish,
    (mealDish) => mealDish.serving,
  )
  mealDishes: MealDish[]

  public toResponse(): ServingResponse{
    const response = new ServingResponse()
    response.id = this.id
    response.dish = this.dish.toResponse()
    response.name = this.name
    response.suffix = this.suffix
    response.amount = this.amount
    response.calories = this.calories
    response.protein = this.protein
    response.fat = this.fat
    response.fat_trans = this.fat_trans
    response.fat_saturated = this.fat_saturated
    response.fat_monounsaturated = this.fat_monounsaturated
    response.fat_polyunsaturated = this.fat_polyunsaturated
    response.carbohydrate = this.carbohydrate
    response.fiber = this.fiber
    response.sugar = this.sugar
    response.cholesterol = this.cholesterol
    response.sodium = this.sodium
    response.potassium = this.potassium
    response.vitamin_c = this.vitamin_c
    response.vitamin_a = this.vitamin_a
    response.vitamin_d = this.vitamin_d
    response.calcium = this.calcium
    response.iron = this.iron
    return response
  }
}

export class ServingResponse{
  id: number
  dish: DishResponse
  name: string
  suffix: string
  amount: number;
  calories: number;
  protein: number;
  fat: number;
  fat_trans: number | null;
  fat_saturated: number | null;
  fat_monounsaturated: number | null;
  fat_polyunsaturated: number | null;
  carbohydrate: number;
  fiber: number | null;
  sugar: number | null;
  cholesterol: number | null;
  sodium: number | null;
  potassium: number | null;
  vitamin_c: number | null;
  vitamin_a: number | null;
  vitamin_d: number | null;
  calcium: number | null;
  iron: number | null;
}