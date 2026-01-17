import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { UserModel } from '../DB/models/schema.usermodel';
import { UserRepo } from 'src/DB/repo/userRepo';
import { OTPRepo } from 'src/DB/repo/otp.repo';
import { OTPModel } from 'src/DB/models/otp.modelSchema';
import { OTPService } from 'src/common/utils/EmailUser/creatOTP';
import { JwtService } from '@nestjs/jwt';
import { JWT } from 'src/common/utils/security/jwt.token';

@Module({
  imports: [UserModel, OTPModel],
  providers: [AuthService,UserRepo,OTPRepo,OTPService,JwtService,JWT],
  controllers: [AuthController]
})
export class AuthModule {}
