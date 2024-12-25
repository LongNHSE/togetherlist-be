import { MailerService } from '@nestjs-modules/mailer';
import { Injectable } from '@nestjs/common';
import { first } from 'rxjs';
import { formatDate } from 'src/utils';
@Injectable()
export class MailService {
  constructor(private mailerService: MailerService) {}

  async sendUserOTP(email: string, otp: string) {
    try {
      await this.mailerService.sendMail({
        to: email,
        from: 'Together_List <togetherlistlistittogether@gmail.com>',
        subject: 'OTP for your account',
        template: './OTP',
        context: {
          imageUrl:
            'https://firebasestorage.googleapis.com/v0/b/togetherlist-e8f05.appspot.com/o/icon%2FGroup%20392.png?alt=media&token=441d1823-fed8-499c-82d0-45a9dde5ed4c',
          otp,
        },
      });
      return true;
    } catch (e) {
      console.log(e);
      return false;
    }
  }

  async sendReportTask(reportTask: any, member: any) {
    if (!reportTask?.assignee) {
      reportTask.assignee = { firstName: 'Unassigned', lastName: '' };
    }
    member.forEach(async (element: any) => {
      try {
        // await this.mailerService.sendMail({
        //   to: element.member.email,
        //   from: 'Together_List <togetherlistlistittogether@gmail.com>',
        //   subject: 'Report Task',
        //   template: './task_report',
        //   context: {
        //     arrow:
        //       'https://firebasestorage.googleapis.com/v0/b/togetherlist-e8f05.appspot.com/o/icon%2Farrow-right.png?alt=media&token=52d14def-84ee-4cdf-91c2-d75433d4a1ef',
        //     imageUrl:
        //       'https://firebasestorage.googleapis.com/v0/b/togetherlist-e8f05.appspot.com/o/icon%2FGroup%20392.png?alt=media&token=441d1823-fed8-499c-82d0-45a9dde5ed4c',
        //     workName: reportTask.workspace.name,
        //     taskName: reportTask.task.name,
        //     index: reportTask.task.index,
        //     boardName: reportTask.board.name,
        //     firstName: reportTask.assignee.firstName,
        //     lastName: reportTask.assignee.lastName,
        //     oldStatus: reportTask.oldStatus,
        //     newStatus: reportTask.newStatus,
        //     updatedAt: formatDate(reportTask.updatedAt),
        //   },
        // });
      } catch (e) {
        console.log(e);
      }
    });
  }

  async sendReportAssigneeTask(reportTask: any, member: any) {
    if (!reportTask?.assignee) {
      reportTask.assignee = { firstName: 'Unassigned', lastName: '' };
    }
    try {
      // await this.mailerService.sendMail({
      //   to: reportTask.assignee.email,
      //   from: 'Together_List <togetherlistlistittogether@gmail.com>',
      //   subject: 'Report Task',
      //   template: './task_report',
      //   context: {
      //     arrow:
      //       'https://firebasestorage.googleapis.com/v0/b/togetherlist-e8f05.appspot.com/o/icon%2Farrow-right.png?alt=media&token=52d14def-84ee-4cdf-91c2-d75433d4a1ef',
      //     imageUrl:
      //       'https://firebasestorage.googleapis.com/v0/b/togetherlist-e8f05.appspot.com/o/icon%2FGroup%20392.png?alt=media&token=441d1823-fed8-499c-82d0-45a9dde5ed4c',
      //     workName: reportTask.workspace.name,
      //     taskName: reportTask.task.name,
      //     index: reportTask.task.index,
      //     boardName: reportTask.board.name,
      //     firstName: reportTask.assignee.firstName,
      //     lastName: reportTask.assignee.lastName,
      //     oldStatus: reportTask.oldStatus,
      //     newStatus: reportTask.newStatus,
      //     updatedAt: formatDate(reportTask.updatedAt),
      //   },
      // });
    } catch (e) {
      console.log(e);
    }
  }
}
