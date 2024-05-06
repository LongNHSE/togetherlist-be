import { Injectable } from '@nestjs/common';
import { CreateOtpDto } from './dto/create-otp.dto';
import { UpdateOtpDto } from './dto/update-otp.dto';
import { InjectModel } from '@nestjs/mongoose';
import { OTP, OTPDocument } from './schema/otp.schema';
import { Model } from 'mongoose';

@Injectable()
export class OtpService {
  findOneByMailAndOTP(mail: string, OTP: string) {
    return this.OtpModel.findOne({ mail: mail }, { OTP: OTP });
  }
  constructor(@InjectModel(OTP.name) private OtpModel: Model<OTPDocument>) {}
  findOneByMail(email: string) {
    return this.OtpModel.findOne({ mail: email });
  }
  create(createOtpDto: CreateOtpDto) {
    return this.OtpModel.create(createOtpDto);
  }

  findAll() {
    return `This action returns all otp`;
  }

  findOne(id: number) {
    return `This action returns a #${id} otp`;
  }

  update(id: number, updateOtpDto: UpdateOtpDto) {
    return `This action updates a #${id} otp`;
  }

  remove(id: number) {
    return `This action removes a #${id} otp`;
  }
}
