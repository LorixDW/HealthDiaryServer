import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Record } from '../models/record';
import { UserModule } from '../user/user.module';
import { AnalyzeService } from './analyze.service';
import { AnalyzeController } from './analyze.controller';

@Module({
  imports: [
    UserModule,
    TypeOrmModule.forFeature([Record])
  ],
  providers: [AnalyzeService],
  controllers: [AnalyzeController],
  exports: [AnalyzeService]
})
export class AnalyzeModule {}
