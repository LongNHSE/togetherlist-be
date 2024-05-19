import { Module } from '@nestjs/common';
import { AuthModule } from './modules/auth/auth.module';
import { UserModule } from './modules/user/user.module';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MailModule } from './modules/mail/mail.module';
import { OtpModule } from './modules/otp/otp.module';
import { ImageModule } from './modules/image/image.module';
import { FirebaseModule } from './modules/firebase/firebase.module';
import { InvoiceModule } from './modules/invoice/invoice.module';
import { TransactionModule } from './modules/transaction/transaction.module';
import { SubscriptionPlanModule } from './modules/subscription-plan/subscription-plan.module';
import { WorkspaceModule } from './modules/workspace/workspace.module';
import { TaskModule } from './modules/task/task.module';
import { BoardModule } from './modules/board/board.module';
import { SectionModule } from './modules/section/section.module';
import { MemberModule } from './modules/member/member.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: '.env',
    }),
    AuthModule,
    MailModule,
    UserModule,
    OtpModule,
    ImageModule,
    FirebaseModule,
    InvoiceModule,
    TransactionModule,
    SubscriptionPlanModule,
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        uri: configService.get<string>('CONNECTION_STRING'),
      }),
      inject: [ConfigService],
    }),
    WorkspaceModule,
    TaskModule,
    BoardModule,
    SectionModule,
    MemberModule,
  ],
  providers: [],
})
export class AppModule {}
