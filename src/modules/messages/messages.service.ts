import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { GetMessagesDto } from './dto/get-messages.dto';
import { CreateMessageDto } from './dto/create-message.dto';
import { Message, MessageDocument } from './schema/message.schema';

@Injectable()
export class MessagesService {
  constructor(
    @InjectModel(Message.name)
    private readonly messageModel: Model<MessageDocument>,
  ) {}

  async getMessages(getMessagesDto: GetMessagesDto): Promise<Message[]> {
    return this.messageModel.find({ room: getMessagesDto.roomId }).exec();
  }

  async createMessage(
    createMessageDto: CreateMessageDto,
    user: any,
  ): Promise<Message> {
    console.log(user);
    const createdMessage = new this.messageModel({
      // ...createMessageDto,
      roomChat: createMessageDto.roomChatId,
      content: createMessageDto.content,
      sender: user.userId,
    });
    return createdMessage.save();
  }

  getMessagesByRoomId(roomId: string): Promise<Message[]> {
    return this.messageModel
      .find({
        roomChat: new Types.ObjectId(roomId),
      })
      .populate('sender')
      .populate('task')
      .exec();
  }
}
