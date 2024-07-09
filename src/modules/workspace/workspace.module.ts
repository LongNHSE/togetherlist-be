import { Module } from '@nestjs/common';
import { WorkspaceService } from './workspace.service';
import { WorkspaceController } from './workspace.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { WorkSpace, workspaceSchema } from './schema/workspace.schema';
import { IsWorkspaceExistConstraint } from './validator/is-workspace-existed.validator';
import { UserModule } from '../user/user.module';
import { MemberModule } from '../member/member.module';
import { TaskModule } from '../task/task.module';

@Module({
  controllers: [WorkspaceController],
  imports: [
    UserModule,
    MemberModule,
    MongooseModule.forFeature([
      { name: WorkSpace.name, schema: workspaceSchema },
    ]),
    TaskModule,
  ],
  providers: [WorkspaceService, IsWorkspaceExistConstraint],
  exports: [WorkspaceService],
})
export class WorkspaceModule {}
