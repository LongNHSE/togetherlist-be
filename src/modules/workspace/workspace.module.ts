import { Module } from '@nestjs/common';
import { WorkspaceService } from './workspace.service';
import { WorkspaceController } from './workspace.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { WorkSpace, workspaceSchema } from './schema/workspace.schema';
import { MemberModule } from '../member/member.module';

@Module({
  controllers: [WorkspaceController],
  imports: [
    MemberModule,
    MongooseModule.forFeature([
      { name: WorkSpace.name, schema: workspaceSchema },
    ]),
  ],
  providers: [WorkspaceService],
  exports: [WorkspaceService],
})
export class WorkspaceModule {}
