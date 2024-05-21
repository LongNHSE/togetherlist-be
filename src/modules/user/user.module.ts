import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { User, userSchema } from './schema/user.schema';
import { ImageModule } from '../image/image.module';
import { JwtModule } from '@nestjs/jwt';
import { OTP, otpSchema } from '../otp/schema/otp.schema';

@Module({
  controllers: [UserController],
  imports: [
    ImageModule,
    MongooseModule.forFeature([{ name: User.name, schema: userSchema }]),
    MongooseModule.forFeature([{ name: OTP.name, schema: otpSchema }]),
    JwtModule.register({})
  ],
  providers: [UserService],
  exports: [UserService],
})
export class UserModule {}
