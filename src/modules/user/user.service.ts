import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectModel } from '@nestjs/mongoose';
import { User } from './schema/user.schema';
import { Model, ObjectId } from 'mongoose';

@Injectable()
export class UserService {
  updateImage(id: string, urlResult: string) {
    return this.userModel.findByIdAndUpdate(
      id,
      { avatar: urlResult },
      {
        new: true,
      },
    );
  }
  constructor(@InjectModel(User.name) private userModel: Model<User>) {}

  create(createUserDto: CreateUserDto) {
    return 'This action adds a new user';
  }
  checkExistedEmail(email: string) {
    return this.userModel.findOne({
      email: email,
    });
  }
  async findAll() {
    return this.userModel.find();
  }

  findOne(id: number) {
    return `This action returns a #${id} user`;
  }

  update(id: string, updateUserDto: UpdateUserDto) {
    return this.userModel.findByIdAndUpdate(id, updateUserDto, {
      new: true,
    });
  }

  remove(id: number) {
    return `This action removes a #${id} user`;
  }
}
