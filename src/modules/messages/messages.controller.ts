import {
  Body,
  Controller,
  Get,
  Post,
  Query,
  UseGuards,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';

import { MessagesService } from './messages.service';
import { GetMessagesDto } from './dto/get-messages.dto';
import { CreateMessageDto } from './dto/create-message.dto';
import { AuthGuard } from '@nestjs/passport';
import { GetUser } from 'src/common/decorator/user.decorator';

@Controller('messages')
// @UseGuards(JwtAuthGuard)
export class MessagesController {
  constructor(private readonly messagesService: MessagesService) {}

  @Get()
  getMessages(@Query() getMessagesDto: GetMessagesDto) {
    return this.messagesService.getMessages(getMessagesDto);
  }

  @Post()
  @UseGuards(AuthGuard('jwt'))
  @UsePipes(new ValidationPipe())
  createMessage(
    @Body() createMessageDto: CreateMessageDto,
    @GetUser() user: any,
  ) {
    return this.messagesService.createMessage(createMessageDto, user);
  }
}
