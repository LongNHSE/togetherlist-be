import { Module } from '@nestjs/common';
import { AuthModule } from './modules/auth/auth.module';
import { UserModule } from './modules/user/user.module';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MailModule } from './modules/mail/mail.module';
import { OtpModule } from './modules/otp/otp.module';
import { ImageModule } from './modules/image/image.module';
import { FirebaseModule } from './firebase/firebase.module';
import { InvoiceModule } from './modules/invoice/invoice.module';
import { TransactionModule } from './modules/transaction/transaction.module';
import { SubscriptionPlanModule } from './modules/subscription-plan/subscription-plan.module';
import { WorkspaceModule } from './modules/workspace/workspace.module';
import { TaskModule } from './modules/task/task.module';
import { BoardModule } from './modules/board/board.module';
import { SectionModule } from './modules/section/section.module';
import { MemberModule } from './modules/member/member.module';
import { PaymentModule } from './modules/payment/payment.module';
import { MessagesModule } from './modules/messages/messages.module';
import { RoomModule } from './modules/room/room.module';
import { ChatModule } from './modules/chat/chat.module';
import { BullModule } from '@nestjs/bullmq';
import { ReportTaskModule } from './modules/report-task/report-task.module';
import { NotificationModule } from './modules/notification/notification.module';
import { SessionModule } from './modules/session/session.module';
import { TestSocketModule } from './modules/test-socket/test-socket.module';
import { SubscriptionTypeModule } from './modules/subscription_type/subscription_type.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: '.env',
    }),
    BullModule.forRoot({
      connection: {
        host: 'localhost',
        port: 6379,
      },
    }),
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        uri: configService.get<string>('CONNECTION_STRING'),
      }),
      inject: [ConfigService],
    }),
    AuthModule,
    MailModule,
    UserModule,
    OtpModule,
    ImageModule,
    FirebaseModule,
    InvoiceModule,
    NotificationModule,
    TransactionModule,
    SubscriptionPlanModule,
    WorkspaceModule,
    TaskModule,
    BoardModule,
    SectionModule,
    MemberModule,
    ChatModule,
    MessagesModule,
    RoomModule,
    PaymentModule,
    ReportTaskModule,
    SessionModule,
    TestSocketModule,
    SubscriptionTypeModule,
  ],
  providers: [],
})
export class AppModule {}
