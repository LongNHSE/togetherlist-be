import { ForbiddenException, HttpException, Injectable } from '@nestjs/common';
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
@Injectable({})
export class AuthService {
  constructor(
    @InjectModel(User.name) private userModel: Model<UserDocument>,
    private jwt: JwtService,
    private config: ConfigService,
    private blackListTokenService: BlackListTokenService,
  ) {}

  async login(LoginDTO: LoginDTO, response: Response) {
    const user: AuthDTO | null = await this.userModel.findOne({
      username: LoginDTO.username,
    });
    if (!user) {
      return apiFailed(404, {}, 'User not found');
    }
    const match = await bcrypt.compare(LoginDTO.password, user.password);
    if (!match) {
      return apiFailed(404, {}, 'Password is incorrect');
    }
    const token = await this.signToken(user._id);
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
      const token = await this.signToken(newUser._id);
      await newUser.save();
      const refreshToken = await this.updateRefreshToken(newUser._id);
      newUser.password = '';
      newUser.refreshToken = '';
      console.log(newUser);
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

  async signToken(userId: string): Promise<string> {
    const secret = this.config.get('JWT_SECRET');
    return this.jwt.signAsync({ userId }, { expiresIn: '15m', secret: secret });
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

  async refreshTokens(userId: string, refreshToken: string) {
    console.log(userId, refreshToken);
    const user = await this.userModel.findById(userId);
    console.log(user);
    if (!user || !user.refreshToken)
      throw new ForbiddenException('Access Denied');
    const refreshTokenMatches = refreshToken === user.refreshToken;
    console.log(refreshTokenMatches);
    if (!refreshTokenMatches) throw new ForbiddenException('Access Denied');
    const tokens = await this.signToken(user.id);
    return tokens;
  }

  async decodeToken(token: string) {
    const decodedToken = await this.jwt.verifyAsync(token);
    return decodedToken;
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

  async verifyToken(token: string): Promise<boolean> {
    if (!token) {
      throw new HttpException('Token is required', 400);
    }
    const decodedToken = await this.decodeToken(token);
    if (decodedToken.userId && decodedToken.exp < Date.now()) {
      const account = await this.userModel.findById(decodedToken.userId);
      if (account?._id === decodedToken.userId) {
        return true;
      }
    }
    return false;
  }
}
// Path: src/auth/dto/auth.dto.ts
