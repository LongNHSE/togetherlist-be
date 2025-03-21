import {
  ForbiddenException,
  HttpException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { AuthDTO, LoginDTO } from './dto';
import * as bcrypt from 'bcrypt';
import { InjectModel } from '@nestjs/mongoose';
import { User, UserDocument } from '../user/schema/user.schema';
import { Model } from 'mongoose';
import { MongoServerError } from 'mongodb';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { Response } from 'express';
import { apiFailed } from 'src/common/api-response';
import { BlackListTokenService } from '../black-list-token/black-list-token.service';
import passport, { use } from 'passport';
import { SubscriptionPlanService } from '../subscription-plan/subscription-plan.service';
@Injectable({})
export class AuthService {
  constructor(
    @InjectModel(User.name) private userModel: Model<UserDocument>,
    private jwt: JwtService,
    private config: ConfigService,
    private blackListTokenService: BlackListTokenService,
    private subscriptionPlanService: SubscriptionPlanService,
  ) {}

  async login(LoginDTO: LoginDTO, response: Response) {
    const user: User | null = await this.userModel.findOne({
      username: LoginDTO.username,
    });
    if (!user) {
      return apiFailed(404, {}, 'User not found');
    }
    const match = await bcrypt.compare(LoginDTO.password, user.password);
    if (!match) {
      return apiFailed(404, {}, 'Password is incorrect');
    }
    const token = await this.signToken(user._id, user);
    const refreshToken = await this.updateRefreshToken(user._id);
    user.password = '';
    user.refreshToken = '';
    response.cookie('Authentication', token, {
      httpOnly: true,
      secure: true,
      sameSite: 'none',
      maxAge: 900000,
    });
    response.cookie('Refresh', refreshToken, {
      httpOnly: true,
      secure: true,
      sameSite: 'none',
      maxAge: 604800000,
    });
    return {
      statusCode: 200,
      message: 'Login successfully',
      token: token,
      refreshToken: refreshToken,
      user: user,
    };
  }

  async register(dto: AuthDTO): Promise<string | any> {
    //generate password hash
    const hash = await bcrypt.hash(dto.password, 10);
    //create new user
    try {
      const newUser = new this.userModel({ ...dto, password: hash });
      const token = await this.signToken(newUser._id, newUser);
      await newUser.save();
      const refreshToken = await this.updateRefreshToken(newUser._id);
      const subscriptionPlan =
        await this.subscriptionPlanService.createFreeSubscriptionPlan(
          newUser._id,
        );
      newUser.password = '';
      newUser.refreshToken = '';
      return {
        statusCode: 201,
        message: 'Created successfully',
        token: token,
        refreshToken: refreshToken,
        user: newUser,
      };
    } catch (e) {
      if (e instanceof MongoServerError) {
        if (e.code === 11000) {
          console.log(e);
          return e;
        }
        return e;
      } else {
        return { message: 'Something went wrong', statusCode: 500 };
      }
    }
  }

  async logout(userId: string, token: string): Promise<boolean> {
    try {
      console.log(token);
      await this.userModel.findByIdAndUpdate(userId, { refreshToken: null });
      await this.blackListTokenService.createBlackListToken(token);
      return true;
    } catch (error) {
      console.error(error);
      throw new Error('Logout failed');
    }
  }

  async signToken(userId: string, user: User): Promise<string> {
    const secret = this.config.get('JWT_SECRET');
    return this.jwt.signAsync(
      { userId, role: user.role },
      { expiresIn: '15m', secret: secret },
    );
  }

  async updateRefreshToken(userId: string): Promise<string> {
    const secret = this.config.get('JWT_REFRESH_SECRET');
    const refreshToken = await this.jwt.signAsync(
      { userId },
      { expiresIn: '7d', secret: secret },
    );
    await this.userModel.findByIdAndUpdate(userId, {
      refreshToken: refreshToken,
    });
    return refreshToken;
  }

  async refreshTokens(refreshToken: string) {
    const { userId } = await this.jwt.verifyAsync(refreshToken, {
      secret: this.config.get('JWT_REFRESH_SECRET'),
      algorithms: ['HS256'],
    });
    const user = await this.userModel.findById(userId);
    if (!user || !user.refreshToken)
      throw new UnauthorizedException('Access Denied');
    const refreshTokenMatches = refreshToken === user.refreshToken;
    if (!refreshTokenMatches)
      throw new ForbiddenException(
        'Refresh token has been revoked. Please log in again.',
      );
    const tokens = await this.signToken(user.id, user);
    return tokens;
  }

  async decodeToken(token: string) {
    try {
      const secret = this.config.get('JWT_SECRET');
      const decodedToken = await this.jwt.verifyAsync(token, {
        secret: secret,
        algorithms: ['HS256'],
      });
      return decodedToken;
    } catch (e) {
      throw new HttpException('Token is invalid', 400);
    }
  }

  async verifyAdminToken(token: string): Promise<boolean> {
    if (!token) {
      throw new HttpException('Token is required', 400);
    }
    const decodedToken = await this.decodeToken(token);
    if (decodedToken.userId && decodedToken.exp < Date.now()) {
      const account = await this.userModel.findById(decodedToken.userId);
      if (account?._id === decodedToken.userId && account?.role === 'admin') {
        return true;
      }
    }
    return false;
  }

  async verifyStaffToken(token: string): Promise<boolean> {
    if (!token) {
      throw new HttpException('Token is required', 400);
    }
    const decodedToken = await this.decodeToken(token);
    if (decodedToken.userId && decodedToken.exp < Date.now()) {
      const account = await this.userModel.findById(decodedToken.userId);
      if (
        account?._id === decodedToken.userId &&
        (account?.role === 'admin' || account?.role === 'staff')
      ) {
        return true;
      }
    }
    return false;
  }

  async verifyToken(token: string): Promise<string | null> {
    try {
      if (!token) {
        throw new HttpException('Token is required', 400);
      }
      const decodedToken = await this.decodeToken(token);
      if (decodedToken.userId && decodedToken.exp < Date.now()) {
        return decodedToken.userId;
      }
      return null;
    } catch (e) {
      return null;
    }
  }
  // Path: src/auth/dto/auth.dto.ts
}
