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
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthDTO, LoginDTO } from './dto';
import { AuthGuard } from '@nestjs/passport';
import { GetUser } from './decorator';
import { MailService } from 'src/mail/mail.service';
import { CreateOtpDto } from 'src/otp/dto/create-otp.dto';
import { UserService } from 'src/user/user.service';
import { OtpService } from 'src/otp/otp.service';

@Controller('auth')
export class AuthController {
  constructor(
    private authService: AuthService,
    private userService: UserService,
    private otpService: OtpService,
    private mailService: MailService,
  ) {}
  @Post('signin')
  signin(@Body() body: LoginDTO) {
    console.log(body);
    console.log('signin');
    return this.authService.login(body);
  }
  @Post('signup')
  register(@Body() body: AuthDTO) {
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
  async verifyOTP(@Body() body: { mail: string; OTP: string }) {
    const otp = await this.otpService.findOneByMailAndOTP(body.mail, body.OTP);
    if (otp) {
      if (otp.OTP === body.OTP) {
        return {
          statusCode: 200,
          message: 'OTP verified successfully',
          mail: body.mail,
        };
      } else {
        throw new HttpException('Invalid OTP', HttpStatus.BAD_REQUEST);
      }
    } else {
      throw new HttpException('OTP not found', HttpStatus.NOT_FOUND);
    }
  }
}
