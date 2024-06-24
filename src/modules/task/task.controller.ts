import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { TaskService } from './task.service';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { BoardService } from '../board/board.service';
import { apiSuccess } from 'src/common/api-response';
import { SectionService } from '../section/section.service';
import mongoose from 'mongoose';

@Controller('tasks')
export class TaskController {
  constructor(
    private readonly taskService: TaskService,
    private readonly boardService: BoardService,
    private readonly sectionService: SectionService,
  ) {}

  @Post()
  @UsePipes(new ValidationPipe())
  async create(@Body() createTaskDto: CreateTaskDto) {
    try {
      const totalTask = await this.boardService.getTotalTask(
        createTaskDto.board,
      );
      createTaskDto.index = totalTask + 1;

      const result = await this.taskService.create(createTaskDto);
      if (result) {
        await this.sectionService.pushTask(
          createTaskDto.section,
          new mongoose.Types.ObjectId(result._id),
        );
        await this.boardService.updateIndex(createTaskDto.board);
        return apiSuccess(200, result, 'Test');
      }
    } catch (error) {}
  }

  @Get()
  findAll() {
    return this.taskService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.taskService.findOne(+id);
  }

  @Patch(':id')
  async update(@Param('id') id: string, @Body() updateTaskDto: UpdateTaskDto) {
    try {
      const result = await this.taskService.update(id, updateTaskDto);
      if (result) {
        return apiSuccess(200, result, 'Update task successfully');
      } else {
        return apiSuccess(400, {}, 'Update task failed');
      }
    } catch (error) {
      console.log(error);
    }
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    try {
      const result = await this.taskService.remove(id);
      if (result) {
        return apiSuccess(200, result, 'Delete task successfully');
      } else {
        return apiSuccess(400, {}, 'Delete task failed');
      }
    } catch (error) {
      console.log(error);
      return apiSuccess(400, {}, 'Delete task failed');
    }
  }
}
