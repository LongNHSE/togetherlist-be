import { WebSocketGateway } from '@nestjs/websockets';
import { TestSocketService } from './test-socket.service';

@WebSocketGateway()
export class TestSocketGateway {
  constructor(private readonly testSocketService: TestSocketService) {}
}
