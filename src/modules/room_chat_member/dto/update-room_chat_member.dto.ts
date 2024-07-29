import { PartialType } from '@nestjs/swagger';
import { CreateRoomChatMemberDto } from './create-room_chat_member.dto';

export class UpdateRoomChatMemberDto extends PartialType(CreateRoomChatMemberDto) {}
