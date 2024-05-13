import {
  BadRequestException,
  Body,
  Controller,
  Get,
  HttpException,
  HttpStatus,
  Post,
  Req,
  UseGuards,
  Res,
  UseInterceptors,
  ClassSerializerInterceptor,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthDTO, LoginDTO } from './dto';
import { AuthGuard } from '@nestjs/passport';
import { GetUser } from './decorator';
import { MailService } from '../mail/mail.service';
import { CreateOtpDto } from '../otp/dto/create-otp.dto';
import { UserService } from '../user/user.service';
import { OtpService } from '../otp/otp.service';
import { Response } from 'express';
import MongooseClassSerializerInterceptor from 'src/interceptors/mongoose-class-serializer.interceptor';
import { User } from '../user/schema/user.schema';

@Controller('auth')
export class AuthController {
  constructor(
    private authService: AuthService,
    private userService: UserService,
    private otpService: OtpService,
    private mailService: MailService,
  ) {}
  @Post('signin')
  @UseInterceptors(MongooseClassSerializerInterceptor(User))
  async signin(
    @Body() body: LoginDTO,
    @Res({ passthrough: true }) response: Response,
  ) {
    return this.authService.login(body, response);
  }
  @Post('signup')
  register(@Body() body: AuthDTO) {
    console.log(body);

    return this.authService.register(body);
  }
  @Get('logout')
  @UseGuards(AuthGuard('jwt'))
  async logout(@GetUser() user: any) {
    console.log(user);
    if (user.userId) {
      return this.authService.logout(user.userId);
    } else {
      throw new BadRequestException('Invalid user ID');
    }
  }

  @Post('refresh')
  @UseGuards(AuthGuard('jwt-refresh'))
  async refresh(@Req() req: any) {
    console.log(req.user);
    const userId = req.user['userId'];
    const refreshToken = req.user['refreshToken'];
    const accessToken = await this.authService.refreshTokens(
      userId,
      refreshToken,
    );
    console.log(accessToken);
    return {
      statusCode: 200,
      message: 'Token refreshed successfully',
      accessToken: accessToken,
    };
  }

  @Post('sendOTP')
  async sendOTP(@Body() body: { email: string }) {
    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    const createDTO: CreateOtpDto = {
      mail: body.email,
      OTP: otp,
      expireAt: new Date(Date.now() + 300000),
    };
    const checkUser = await this.userService.checkExistedEmail(body.email);
    if (checkUser) {
      throw new HttpException(
        'Email is already taken, please use another one!!!',
        HttpStatus.CONFLICT,
      );
    }
    console.log(createDTO);
    const isSended = await this.mailService.sendUserOTP(createDTO.mail, otp);
    const isCreated = await this.otpService.create(createDTO);
    if (isSended && isCreated) {
      return {
        statusCode: 200,
        message: 'OTP sent successfully',
      };
    } else {
      throw new HttpException(
        'OTP sending failed',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Post('verifyOTP')
  async verifyOTP(@Body() body: { email: string; OTP: string }) {
    console.log(body);
    const otp = await this.otpService.findOneByMailAndOTP(body.email, body.OTP);
    console.log(otp);
    if (otp) {
      if (otp.OTP === body.OTP) {
        return {
          statusCode: 200,
          message: 'OTP verified successfully',
          email: body.email,
        };
      } else {
        throw new HttpException('Invalid OTP', HttpStatus.BAD_REQUEST);
      }
    } else {
      throw new HttpException('Invalid OTP', HttpStatus.NOT_FOUND);
    }
  }
}