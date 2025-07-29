import { Module } from '@nestjs/common';
import { UserModule } from '../user/user.module';
import { JwtModule } from '@nestjs/jwt';
import { constant } from './constant';
import { AuthController } from './auth.controller';

@Module({
  imports: [
    UserModule,
    JwtModule.register({
      global: true,
      secret: constant.secret,
      signOptions: {expiresIn: '24h'}
    })
  ],
  controllers: [AuthController],
  providers: [

  ]
})
export class AuthModule {}
