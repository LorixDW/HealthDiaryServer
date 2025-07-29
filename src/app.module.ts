import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import {User} from './models/user';
import { Record } from './models/record';
import { Measurement } from './models/measurement';
import { Indicator } from './models/indicator';
import { MeasurementIndicator } from './models/measurement-indicator';
import { RecordPhysicalActivity } from './models/record-physical-activity';
import { PhysicalActivitySubcategory } from './models/physical-activity-subcategory';
import { PhysicalActivityCategory } from './models/physical-activity-category';
import { Serving } from './models/serving';
import { Dish } from './models/dish';
import { MealTime } from './models/meal-time';
import { Meal } from './models/meal';
import { MealDish } from './models/meal-dish';
import { UserModule } from './user/user.module';
import { AuthModule } from './auth/auth.module';
import { RecordModule } from './record/record.module';
import { IndicatorModule } from './indicator/indicator.module';
import { MeasurementModule } from './measurement/measurement.module';
import { ActivityModule } from './activity/activity.module';
import { DishModule } from './dish/dish.module';
import { MealModule } from './meal/meal.module';
import { AnalyzeModule } from './analize/analyze.module';
import { NotificationModule } from './notification/notification.module';
import { Notification } from './models/notification';
import { BindingType } from './models/binding-type';
@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'localhost',
      port: 5432,
      username: 'postgres',
      password: 'xcvZ3412',
      database: 'HealthDB',
      entities: [
        User,
        Record,
        Measurement,
        MeasurementIndicator,
        Indicator,
        RecordPhysicalActivity,
        PhysicalActivitySubcategory,
        PhysicalActivityCategory,
        Serving,
        Dish,
        MealTime,
        Meal,
        MealDish,
        Notification,
        BindingType
      ],
      synchronize: true
    }),

    UserModule,
    AuthModule,
    RecordModule,
    IndicatorModule,
    MeasurementModule,
    ActivityModule,
    DishModule,
    MealModule,
    AnalyzeModule,
    NotificationModule
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
