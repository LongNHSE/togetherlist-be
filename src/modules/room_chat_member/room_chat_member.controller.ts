import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { RoomChatMemberService } from './room_chat_member.service';
import { CreateRoomChatMemberDto } from './dto/create-room_chat_member.dto';
import { UpdateRoomChatMemberDto } from './dto/update-room_chat_member.dto';

@Controller('room-chat-member')
export class RoomChatMemberController {
  constructor(private readonly roomChatMemberService: RoomChatMemberService) {}

  @Post()
  create(@Body() createRoomChatMemberDto: CreateRoomChatMemberDto) {
    return this.roomChatMemberService.create(createRoomChatMemberDto);
  }

  @Get()
  findAll() {
    return this.roomChatMemberService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.roomChatMemberService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateRoomChatMemberDto: UpdateRoomChatMemberDto) {
    return this.roomChatMemberService.update(+id, updateRoomChatMemberDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.roomChatMemberService.remove(+id);
  }
}
