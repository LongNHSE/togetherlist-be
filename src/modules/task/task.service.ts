import { Injectable } from '@nestjs/common';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Task } from './schema/task.schema';
import { Model } from 'mongoose';
import { Section } from '../section/schema/section.schema';
import { Board } from '../board/schema/board.schema';

@Injectable()
export class TaskService {
  constructor(
    @InjectModel(Task.name) private readonly taskModel: Model<Task>,
    @InjectModel(Section.name) private readonly sectionModel: Model<Section>,
    @InjectModel(Board.name) private boardModel: Model<Board>,
  ) {}

  create(createTaskDto: CreateTaskDto) {
    return this.taskModel.create(createTaskDto);
  }

  findAll() {
    return `This action returns all task`;
  }

  findOne(id: number) {
    return `This action returns a #${id} task`;
  }

  async update(id: string, updateTaskDto: UpdateTaskDto) {
    try {
      if (updateTaskDto.section && updateTaskDto.section) {
        await this.sectionModel.updateOne(
          { _id: updateTaskDto?.section },
          { $pull: { tasks: id } },
        );
        await this.sectionModel.updateOne(
          { _id: updateTaskDto.section },
          { $push: { tasks: id } },
        );
      }
      return await this.taskModel.findByIdAndUpdate(id, updateTaskDto, {
        new: true,
      });
    } catch (error) {
      console.log(error);
    }
  }

  async remove(id: string) {
    try {
      const result = await this.taskModel.findByIdAndDelete(id);
      if (result) {
        await this.sectionModel.updateOne(
          { _id: result.section },
          { $pull: { tasks: id } },
        );
        //The toltalTask should not change because it the index of the task
        // const result2 = await this.boardModel.updateOne(
        //   { _id: result.board },
        //   { $inc: { totalTask: -1 } },
        // );
        // console.log(result2);
        return result;
      }
    } catch (error) {
      console.log(error);
    }
  }
}
