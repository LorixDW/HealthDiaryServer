import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Serving } from '../models/serving';
import { Dish } from '../models/dish';
import { HttpModule } from '@nestjs/axios';
import { DishService } from './dish.service';
import { DishController } from './dish.controller';
import { UserModule } from '../user/user.module';

@Module({
  imports: [
    HttpModule,
    UserModule,
    TypeOrmModule.forFeature([Dish, Serving])
  ],
  providers:[
    DishService,
  ],
  controllers:[
    DishController,
  ],
  exports: [
    DishService,
  ]
})
export class DishModule {}
