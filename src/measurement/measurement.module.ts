import { Module } from '@nestjs/common';
import { UserModule } from '../user/user.module';
import { IndicatorModule } from '../indicator/indicator.module';
import { RecordModule } from '../record/record.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Measurement } from '../models/measurement';
import { MeasurementIndicator } from '../models/measurement-indicator';
import { MeasurementService } from './measurement.service';
import { MeasurementController } from './measurement.controller';

@Module({
  imports: [
    UserModule,
    IndicatorModule,
    RecordModule,
    TypeOrmModule.forFeature([Measurement, MeasurementIndicator])
  ],
  providers: [MeasurementService],
  controllers: [MeasurementController],
  exports: [MeasurementService]
})
export class MeasurementModule {}
