import { Injectable } from '@nestjs/common';
import { CreateWorkspaceDto } from './dto/create-workspace.dto';
import { UpdateWorkspaceDto } from './dto/update-workspace.dto';
import { InjectModel } from '@nestjs/mongoose';
import { WorkSpace } from './schema/workspace.schema';
import { Model, Types } from 'mongoose';
import { MemberDto } from './dto/member.dto';

@Injectable()
export class WorkspaceService {
  constructor(
    @InjectModel(WorkSpace.name) private workSpaceModel: Model<WorkSpace>,
  ) {}

  create(createWorkspaceDto: CreateWorkspaceDto) {
    return this.workSpaceModel.create(createWorkspaceDto);
  }

  findAll() {
    return `This action returns all workspace`;
  }

  findOne(id: number) {
    return `This action returns a #${id} workspace`;
  }

  update(id: number, updateWorkspaceDto: UpdateWorkspaceDto) {
    return `This action updates a #${id} workspace`;
  }

  remove(id: number) {
    return `This action removes a #${id} workspace`;
  }

  //Add member to workspaces
  addMember(id: string, memberId: string[]) {
    const objectIds = memberId.map((id) => new Types.ObjectId(id));
    return this.workSpaceModel.findByIdAndUpdate(
      { _id: id },
      { $push: { members: { $each: objectIds } } },
      { new: true },
    );
  }

  isExist(id: string) {
    return this.workSpaceModel.exists({ _id: id });
  }
}
