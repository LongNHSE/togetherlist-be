import { Body, Controller, Get, Post, Query, UseGuards } from '@nestjs/common';

import { MessagesService } from './messages.service';
import { GetMessagesDto } from './dto/get-messages.dto';
import { CreateMessageDto } from './dto/create-message.dto';

@Controller('messages')
// @UseGuards(JwtAuthGuard)
export class MessagesController {
  constructor(private readonly messagesService: MessagesService) {}

  @Get()
  getMessages(@Query() getMessagesDto: GetMessagesDto) {
    return this.messagesService.getMessages(getMessagesDto);
  }

  @Post()
  createMessage(@Body() createMessageDto: CreateMessageDto) {
    return this.messagesService.createMessage(createMessageDto);
  }
}
