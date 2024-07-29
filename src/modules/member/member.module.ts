import { Module } from '@nestjs/common';
import { MemberService } from './member.service';
import { MemberController } from './member.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { MemberSchema } from './schema/member.schema';
import { WorkspaceService } from '../workspace/workspace.service';
import {
  WorkSpace,
  workspaceSchema,
} from '../workspace/schema/workspace.schema';
import { TaskModule } from '../task/task.module';
import { TaskService } from '../task/task.service';
import { Task, taskSchema } from '../task/schema/task.schema';
import { MemberGateway } from './member.gateway';
import { RoomChatModule } from '../room_chat/room_chat.module';

@Module({
  controllers: [MemberController],
  imports: [
    RoomChatModule,
    MongooseModule.forFeature([
      { name: WorkSpace.name, schema: workspaceSchema },
    ]),
    MongooseModule.forFeature([{ name: 'Member', schema: MemberSchema }]),
  ],
  providers: [MemberService, WorkspaceService, MemberGateway],
  exports: [MemberService, MemberGateway],
})
export class MemberModule {}
