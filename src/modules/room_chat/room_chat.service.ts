import { Injectable } from '@nestjs/common';
import { CreateRoomChatDto } from './dto/create-room_chat.dto';
import { UpdateRoomChatDto } from './dto/update-room_chat.dto';
import { InjectModel } from '@nestjs/mongoose';
import { RoomChat } from './schema/room_chat.schema';
import { Model } from 'mongoose';

@Injectable()
export class RoomChatService {
  constructor(
    @InjectModel(RoomChat.name) private readonly roomChatModel: Model<RoomChat>,
  ) {}

  create(createRoomChatDto: CreateRoomChatDto) {
    return this.roomChatModel.create(createRoomChatDto);
  }

  findAll() {
    return `This action returns all roomChat`;
  }

  findOne(id: number) {
    return `This action returns a #${id} roomChat`;
  }

  update(id: number, updateRoomChatDto: UpdateRoomChatDto) {
    return `This action updates a #${id} roomChat`;
  }

  remove(id: number) {
    return `This action removes a #${id} roomChat`;
  }
}
