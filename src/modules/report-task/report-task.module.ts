import { Module } from '@nestjs/common';
import { ReportTaskService } from './report-task.service';
import { ReportTaskController } from './report-task.controller';
import { ReportTask, reportTaskSchema } from './schema/report-task.schema';
import { MongooseModule } from '@nestjs/mongoose';
import { BullModule } from '@nestjs/bullmq';
import {
  AssigneeTaskProcessor,
  ReportTaskProcessor,
} from './report-task.processor';
import { MailService } from 'src/modules/mail/mail.service';
import { MemberService } from 'src/modules/member/member.service';
import { Member, MemberSchema } from 'src/modules/member/schema/member.schema';
import { NotificationModule } from '../notification/notification.module';

@Module({
  imports: [
    NotificationModule,
    MongooseModule.forFeature([
      { name: ReportTask.name, schema: reportTaskSchema },
    ]),
    MongooseModule.forFeature([{ name: Member.name, schema: MemberSchema }]),
    BullModule.registerQueue(
      {
        name: 'report-task-queue',
      },
      {
        name: 'assignee-task-queue',
      },
    ),
  ],
  controllers: [ReportTaskController],
  providers: [
    ReportTaskService,
    ReportTaskProcessor,
    MailService,
    MemberService,
    AssigneeTaskProcessor,
  ],
  exports: [ReportTaskService],
})
export class ReportTaskModule {}
