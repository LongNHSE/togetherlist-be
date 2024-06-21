import { Body, Controller, Get, Post } from '@nestjs/common';
import { RoomService } from './room.service';
import { Room } from './schema/room.schema';
import { CreateRoomDto } from './dto/create-room.dto';
import { UserService } from '../user/user.service';

@Controller('room')
export class RoomController {
  constructor(private readonly roomService: RoomService) {}

  @Post()
  async createRoom(@Body() createRoomDto: CreateRoomDto): Promise<Room> {
    return this.roomService.createRoom(createRoomDto);
  }

  @Get()
  async getAllRooms(): Promise<Room[]> {
    return this.roomService.getAllRooms();
  }
}
