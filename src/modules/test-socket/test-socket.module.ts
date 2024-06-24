import { Module } from '@nestjs/common';
import { TestSocketService } from './test-socket.service';
import { TestSocketGateway } from './test-socket.gateway';

@Module({
  providers: [TestSocketGateway, TestSocketService],
})
export class TestSocketModule {}
