import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Record } from '../models/record';
import { RecordService } from './record.service';
import { RecordController } from './record.controller';
import { UserModule } from '../user/user.module';

@Module({
  imports: [
    UserModule,
    TypeOrmModule.forFeature([Record]),
  ],
  providers: [RecordService],
  controllers: [RecordController],
  exports: [
    RecordService,
  ]
})
export class RecordModule {}
