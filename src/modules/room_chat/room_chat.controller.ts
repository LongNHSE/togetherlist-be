import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UsePipes,
  ValidationPipe,
  UseGuards,
} from '@nestjs/common';
import { RoomChatService } from './room_chat.service';
import { CreateRoomChatDto } from './dto/create-room_chat.dto';
import { UpdateRoomChatDto } from './dto/update-room_chat.dto';
import { AuthGuard } from '@nestjs/passport';
import { GetUser } from '../auth/decorator';
import { CreateMessageDto } from '../messages/dto/create-message.dto';

@Controller('room-chat')
export class RoomChatController {
  constructor(private readonly roomChatService: RoomChatService) {}
  @Get('/my')
  @UseGuards(AuthGuard('jwt'))
  findMyRoomChat(@GetUser() user: any) {
    return this.roomChatService.findMyRoomChat(user.userId);
  }

  @Post()
  @UsePipes(new ValidationPipe())
  create(@Body() createRoomChatDto: CreateRoomChatDto) {
    return this.roomChatService.create(createRoomChatDto);
  }

  @Get()
  findAll() {
    return this.roomChatService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.roomChatService.findOne(+id);
  }

  @Get(':id/messages')
  @UseGuards(AuthGuard('jwt'))
  getAllRoomMessage(@Param('id') id: string) {
    return this.roomChatService.getAllRoomMessage(id);
  }

  @Post(':id/messages')
  @UseGuards(AuthGuard('jwt'))
  @UsePipes(new ValidationPipe())
  createMessage(
    @Body() createMessageDto: CreateMessageDto,
    @GetUser() user: any,
  ) {
    return this.roomChatService.createMessage(createMessageDto, user);
  }

  // @Post(':id/messages')
  // @UseGuards(AuthGuard('jwt'))
  // postMessage(@Param('id') id: string) {
  //   return this.roomChatService.getAllRoomMessage(id);
  // }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateRoomChatDto: UpdateRoomChatDto,
  ) {
    return this.roomChatService.update(+id, updateRoomChatDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.roomChatService.remove(+id);
  }
}
