import { Module } from '@nestjs/common';
import { ActivityController } from './activity.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PhysicalActivityCategory } from '../models/physical-activity-category';
import { PhysicalActivitySubcategory } from '../models/physical-activity-subcategory';
import { CategoryService } from './category.service';
import { SubcategoryService } from './subcategory.service';
import { RecordPhysicalActivity } from '../models/record-physical-activity';
import { UserModule } from '../user/user.module';
import { RecordModule } from '../record/record.module';
import { ActivityService } from './activity.service';

@Module({
  imports: [
    UserModule,
    RecordModule,
    TypeOrmModule.forFeature([
      PhysicalActivityCategory,
      PhysicalActivitySubcategory,
      RecordPhysicalActivity
    ])
  ],
  controllers: [ActivityController],
  providers: [
    CategoryService,
    SubcategoryService,
    ActivityService
  ],
  exports: [
    CategoryService,
    SubcategoryService,
    ActivityService
  ]
})
export class ActivityModule {}
