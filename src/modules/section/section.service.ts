import { Injectable } from '@nestjs/common';
import { CreateSectionDto } from './dto/create-section.dto';
import { UpdateSectionDto } from './dto/update-section.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Section } from './schema/section.schema';
import { Model, Types } from 'mongoose';
import { Board } from '../board/schema/board.schema';
import { Task } from '../task/schema/task.schema';

@Injectable()
export class SectionService {
  updateBoardId(_id: Types.ObjectId, _id1: Types.ObjectId) {
    return this.sectionModel.updateOne({ _id }, { board: _id1 });
  }
  constructor(
    @InjectModel(Section.name) private sectionModel: Model<Section>,
    @InjectModel(Board.name) private boardModel: Model<Board>,
    @InjectModel(Task.name) private readonly taskModel: Model<Task>,
  ) {}

  pushTask(section: string, _id: Types.ObjectId) {
    return this.sectionModel.findByIdAndUpdate(
      { _id: section },
      { $push: { tasks: _id } },
      { new: true },
    );
  }

  createDefaultSection(workspace: string) {
    return this.sectionModel.create({
      name: 'Default Section',
      workspace: workspace,
    });
  }
  async create(createSectionDto: any) {
    const result = await this.sectionModel.create(createSectionDto);
    if (result) {
      await this.boardModel.updateOne(
        { _id: createSectionDto.board },
        { $push: { sections: result._id } },
      );
    }
    return result;
  }

  findAll() {
    return `This action returns all section`;
  }

  findOne(id: number) {
    return `This action returns a #${id} section`;
  }

  update(id: number, updateSectionDto: UpdateSectionDto) {
    return `This action updates a #${id} section`;
  }

  async remove(id: string) {
    try {
      const result = await this.sectionModel.findByIdAndDelete(id);
      if (result) {
        await this.boardModel.updateOne(
          { _id: result.board },
          { $pull: { sections: id } },
        );
        result.tasks.forEach(async (task) => {
          await this.taskModel.findByIdAndDelete(task._id);
        });
        return result;
      }
    } catch (error) {
      console.log(error);
    }
  }
}
