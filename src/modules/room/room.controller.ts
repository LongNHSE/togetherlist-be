import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Query,
  Request,
} from '@nestjs/common';
import { RoomService } from './room.service';
import { ChatService } from '../chat/chat.service';
import { CreateRoomDto } from './dto/create-room.dto';
import { GetChatDto } from '../chat/dto/get-chat.dto';

@Controller('room')
export class RoomController {
  constructor(
    private readonly roomService: RoomService,
    private readonly chatService: ChatService,
  ) {}

  @Post()
  create(@Request() req: any, @Body() createRoomDto: CreateRoomDto) {
    return this.roomService.create(req.user._id.toString(), createRoomDto);
  }

  @Get()
  getByRequest(@Request() req: any) {
    return this.roomService.getByRequest(req.user._id.toString());
  }

  @Get(':id/chats')
  getChat(@Param('id') id: any, @Query() dto: GetChatDto) {
    return this.chatService.findAll(id, new GetChatDto(dto));
  }
}
