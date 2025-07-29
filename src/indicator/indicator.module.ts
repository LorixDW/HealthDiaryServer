import { Module } from '@nestjs/common';
import { UserModule } from '../user/user.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Indicator } from '../models/indicator';
import { IndicatorService } from './indicator.service';
import { IndicatorController } from './indicator.controller';

@Module({
  imports:[
    UserModule,
    TypeOrmModule.forFeature([Indicator])
  ],
  providers: [IndicatorService],
  controllers: [IndicatorController],
  exports: [IndicatorService]
})
export class IndicatorModule {}
