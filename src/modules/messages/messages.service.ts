import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
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

  async createMessage(createMessageDto: CreateMessageDto): Promise<Message> {
    const createdMessage = new this.messageModel(createMessageDto);
    return createdMessage.save();
  }
}
