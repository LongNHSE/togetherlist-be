import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { JwtModule } from '@nestjs/jwt';
import { AuthService } from './auth.service';
import { MongooseModule } from '@nestjs/mongoose';
import { User, userSchema } from 'src/user/schema/user.schema';
import { ConfigModule } from '@nestjs/config';
import { AccessTokenStrategy, RefreshTokenStrategy } from './strategy';
import { MailModule } from 'src/mail/mail.module';
import { OTP, otpSchema } from 'src/otp/schema/otp.schema';
import { UserModule } from 'src/user/user.module';
import { OtpModule } from 'src/otp/otp.module';
@Module({
  controllers: [AuthController],
  providers: [AuthService, AccessTokenStrategy, RefreshTokenStrategy],
  imports: [
    ConfigModule,
    MailModule,
    UserModule,
    OtpModule,
    JwtModule.register({}),
    MongooseModule.forFeature([{ name: User.name, schema: userSchema }]),
    MongooseModule.forFeature([{ name: OTP.name, schema: otpSchema }]),
  ],
})
export class AuthModule {}
