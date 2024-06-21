import { Body, Controller, Get, Param, Patch, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { GetUser } from '../auth/decorator';
import { InjectModel } from '@nestjs/mongoose';
import { Notification } from './schema/notification.schema';
import { Model } from 'mongoose';
import { apiSuccess, apiFailed } from 'src/common/api-response';
import { NotificationService } from './notification.service';

@Controller('notifications')
export class NotificationController {
  constructor(private readonly notificationService: NotificationService) {}
  @Get('/my')
  @UseGuards(AuthGuard('jwt'))
  async getMyNotifications(@GetUser() user: any) {
    try {
      const result = await this.notificationService.getMyNotification(
        user.userId,
      );
      return apiSuccess(200, result, 'Get notifications successfully');
    } catch (e) {
      throw e;
    }
  }

  @Patch('/my/:id')
  @UseGuards(AuthGuard('jwt'))
  async updateNotification(
    @GetUser() user: any,
    @Param('id') id: string,
    @Body() updateNotificationDto: any,
  ) {
    try {
      const result = await this.notificationService.updateStatus(
        id,
        updateNotificationDto.status as string,
      );
      if (result) {
        return apiSuccess(204, result, 'Updated successfully');
      }
      return apiFailed(404, {}, 'Updated failed');
    } catch (e) {
      throw e;
    }
  }
}
