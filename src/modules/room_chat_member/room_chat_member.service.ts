import { Injectable } from '@nestjs/common';
import { CreateRoomChatMemberDto } from './dto/create-room_chat_member.dto';
import { UpdateRoomChatMemberDto } from './dto/update-room_chat_member.dto';

@Injectable()
export class RoomChatMemberService {
  create(createRoomChatMemberDto: CreateRoomChatMemberDto) {
    return 'This action adds a new roomChatMember';
  }

  findAll() {
    return `This action returns all roomChatMember`;
  }

  findOne(id: number) {
    return `This action returns a #${id} roomChatMember`;
  }

  update(id: number, updateRoomChatMemberDto: UpdateRoomChatMemberDto) {
    return `This action updates a #${id} roomChatMember`;
  }

  remove(id: number) {
    return `This action removes a #${id} roomChatMember`;
  }
}
