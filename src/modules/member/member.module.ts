import { Module } from '@nestjs/common';
import { MemberService } from './member.service';
import { MemberController } from './member.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { MemberSchema } from './schema/member.schema';

@Module({
  controllers: [MemberController],
  imports: [
    MongooseModule.forFeature([{ name: 'Member', schema: MemberSchema }]),
  ],
  providers: [MemberService],
  exports: [MemberService],
})
export class MemberModule {}
