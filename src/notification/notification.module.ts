import { Module } from '@nestjs/common';
import { UserModule } from '../user/user.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import {Notification} from '../models/notification';
import { BindingType } from '../models/binding-type';
import { NotificationService } from './notification.service';
import { NotificationController } from './notification.controller';

@Module({
  imports: [
    UserModule,
    TypeOrmModule.forFeature([Notification, BindingType])
  ],
  providers: [NotificationService],
  controllers: [NotificationController],
  exports: [NotificationService]
})
export class NotificationModule {}
