import { PartialType } from '@nestjs/swagger';
import { CreateRoomChatDto } from './create-room_chat.dto';

export class UpdateRoomChatDto extends PartialType(CreateRoomChatDto) {}
