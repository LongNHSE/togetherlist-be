import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { User, userSchema } from './schema/user.schema';
import { ImageModule } from '../image/image.module';
import { IsUserExistsConstraint } from './validator/is-user-exists.validator';

@Module({
  controllers: [UserController],
  imports: [
    ImageModule,
    MongooseModule.forFeature([{ name: User.name, schema: userSchema }]),
  ],
  providers: [UserService, IsUserExistsConstraint],
  exports: [UserService],
})
export class UserModule {}
