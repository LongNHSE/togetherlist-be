import { Injectable } from '@nestjs/common';
import { CreateSectionDto } from './dto/create-section.dto';
import { UpdateSectionDto } from './dto/update-section.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Section } from './schema/section.schema';
import { Model, Types } from 'mongoose';
import { Board } from '../board/schema/board.schema';

@Injectable()
export class SectionService {
  constructor(
    @InjectModel(Section.name) private sectionModel: Model<Section>,
    @InjectModel(Board.name) private boardModel: Model<Board>,
  ) {}

  pushTask(section: string, _id: Types.ObjectId) {
    return this.sectionModel.findByIdAndUpdate(
      { _id: section },
      { $push: { tasks: _id } },
      { new: true },
    );
  }

  createDefaultSection() {
    return this.sectionModel.create({ name: 'Default Section' });
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

  remove(id: number) {
    return `This action removes a #${id} section`;
  }
}
