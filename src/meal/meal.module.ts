import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Meal } from '../models/meal';
import { MealDish } from '../models/meal-dish';
import { MealTime } from '../models/meal-time';
import { RecordModule } from '../record/record.module';
import { UserModule } from '../user/user.module';
import { DishModule } from '../dish/dish.module';
import { MealController } from './meal.controller';
import { MealTimeService } from './meal-time.service';
import { MealService } from './meal.service';

@Module({
  imports: [
    RecordModule,
    UserModule,
    DishModule,
    TypeOrmModule.forFeature([Meal, MealDish, MealTime])
  ],
  controllers: [
    MealController
  ],
  providers: [
    MealTimeService,
    MealService
  ],
  exports: [
    MealService,
    MealTimeService
  ]
})
export class MealModule {}
