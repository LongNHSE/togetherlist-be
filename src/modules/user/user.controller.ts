import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  ValidationPipe,
  UseInterceptors,
  UploadedFile,
  UseGuards,
} from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { ImageService } from '../image/image.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { apiFailed, apiSuccess } from 'src/common/api-response';
import { getNameImageFromUrl } from 'src/utils';
import { AuthGuard } from '@nestjs/passport';

@Controller('users')
export class UserController {
  constructor(
    private readonly userService: UserService,
    private readonly imageService: ImageService,
  ) {}

  @Post()
  create(@Body() createUserDto: CreateUserDto) {
    return this.userService.create(createUserDto);
  }

  @Get()
  findAll() {
    return this.userService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.userService.findOne(+id);
  }

  @Patch(':id')
  @UseGuards(AuthGuard('jwt'))
  async update(
    @Param('id') id: string,
    @Body(new ValidationPipe({ whitelist: true, skipMissingProperties: true }))
    updateUserDto: UpdateUserDto,
  ) {
    console.log(updateUserDto);
    const userUpdated = await this.userService.update(id, updateUserDto);
    return apiSuccess(200, { userUpdated }, 'Update user successfully');
  }

  @Post(':id/avatar')
  @UseGuards(AuthGuard('jwt'))
  @UseInterceptors(FileInterceptor('file'))
  async postAvatar(
    @Param('id') id: string,
    @UploadedFile() file: Express.Multer.File,
  ) {
    try {
      const urlResult = await this.imageService.uploadImage(file);
      const imageName = getNameImageFromUrl(urlResult);
      const updatedUser = await this.userService.updateImage(id, imageName);
      return apiSuccess(200, { updatedUser }, 'Add user avatar successfully');
    } catch (error) {
      return apiFailed(error.statusCode, null, error.message);
    }
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.userService.remove(+id);
  }
}
