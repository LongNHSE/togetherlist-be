import { Module } from '@nestjs/common';
import { WorkspaceService } from './workspace.service';
import { WorkspaceController } from './workspace.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { WorkSpace, workspaceSchema } from './schema/workspace.schema';
import { MemberModule } from '../member/member.module';
import { IsWorkspaceExistConstraint } from './validator/is-workspace-existed.validator';

@Module({
  controllers: [WorkspaceController],
  imports: [
    MemberModule,
    MongooseModule.forFeature([
      { name: WorkSpace.name, schema: workspaceSchema },
    ]),
  ],
  providers: [WorkspaceService, IsWorkspaceExistConstraint],
  exports: [WorkspaceService],
})
export class WorkspaceModule {}
