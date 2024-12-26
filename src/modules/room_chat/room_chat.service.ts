import { HttpCode, HttpStatus, Injectable } from '@nestjs/common';
import { CreateRoomChatDto } from './dto/create-room_chat.dto';
import { UpdateRoomChatDto } from './dto/update-room_chat.dto';
import { InjectConnection, InjectModel } from '@nestjs/mongoose';
import { RoomChat } from './schema/room_chat.schema';
import { Connection, Model, Types } from 'mongoose';
import { apiFailed, apiSuccess } from 'src/common/api-response';
import { MessagesService } from '../messages/messages.service';
import { Room_chatGateway } from './room_chat.gateway';
import { CreateMessageDto } from '../messages/dto/create-message.dto';

@Injectable()
export class RoomChatService {
  constructor(
    @InjectModel(RoomChat.name) private readonly roomChatModel: Model<RoomChat>,
    private readonly messageService: MessagesService,
    private readonly roomChatGateway: Room_chatGateway,
    @InjectConnection() private connection: Connection,
  ) {}
  async createMessage(createMessageDto: CreateMessageDto, user: any) {
    const result = await this.messageService.createMessage(
      createMessageDto,
      user,
    );
    if (result) {
      this.roomChatGateway.handleSendMessage(result);
      return apiSuccess(
        HttpStatus.CREATED,
        result,
        'Message created successfully',
      );
    }
    return result;
  }
  async findMyRoomChat(userId: any) {
    const result = await this.roomChatModel
      .find({
        members: userId,
      })
      .populate('members');
    return apiSuccess(HttpStatus.OK, result, 'Get my room chat successfully');
  }

  async getAllRoomMessage(id: string) {
    const allRoomMessage = await this.messageService.getMessagesByRoomId(id);
    return apiSuccess(
      HttpStatus.OK,
      allRoomMessage,
      'Get all room message successfully',
    );
  }

  async create(createRoomChatDto: CreateRoomChatDto) {
    // Transform the members array to an array of ObjectId values
    const transformedMembers = createRoomChatDto.members.map(
      (member) => new Types.ObjectId(member.userId),
    );

    // Create a new object with the transformed members array
    const transformedDto = {
      ...createRoomChatDto,
      members: transformedMembers,
    };
    const result = await this.roomChatModel.create(transformedDto);

    if (result) {
      return apiSuccess(
        HttpStatus.CREATED,
        result,
        'Room chat created successfully',
      );
    }
    return apiFailed(HttpStatus.BAD_REQUEST, 'Failed to create room chat');
    // return this.roomChatModel.create(createRoomChatDto);
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
