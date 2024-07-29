import { Module } from '@nestjs/common';
import { WorkspaceService } from './workspace.service';
import { WorkspaceController } from './workspace.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { WorkSpace, workspaceSchema } from './schema/workspace.schema';
import { IsWorkspaceExistConstraint } from './validator/is-workspace-existed.validator';
import { UserModule } from '../user/user.module';
import { MemberModule } from '../member/member.module';
import { TaskModule } from '../task/task.module';
import { RoomChatModule } from '../room_chat/room_chat.module';
import { RoomChatService } from '../room_chat/room_chat.service';

@Module({
  controllers: [WorkspaceController],
  imports: [
    UserModule,
    MemberModule,
    TaskModule,
    RoomChatModule,
    MongooseModule.forFeature([
      { name: WorkSpace.name, schema: workspaceSchema },
    ]),
  ],
  providers: [WorkspaceService, IsWorkspaceExistConstraint],
  exports: [WorkspaceService],
})
export class WorkspaceModule {}
