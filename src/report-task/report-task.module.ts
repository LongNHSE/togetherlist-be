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

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: ReportTask.name, schema: reportTaskSchema },
    ]),
    MongooseModule.forFeature([{ name: Member.name, schema: MemberSchema }]),
    BullModule.registerQueue(
      {
        name: 'report-task-queue',
        connection: {
          host: 'localhost',
          port: 6379,
        },
      },
      {
        name: 'assignee-task-queue',
        connection: {
          host: 'localhost',
          port: 6379,
        },
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
})
export class ReportTaskModule {}
