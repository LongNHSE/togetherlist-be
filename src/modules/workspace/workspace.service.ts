import { Injectable } from '@nestjs/common';
import { CreateWorkspaceDto } from './dto/create-workspace.dto';
import { UpdateWorkspaceDto } from './dto/update-workspace.dto';
import { InjectModel } from '@nestjs/mongoose';
import { WorkSpace } from './schema/workspace.schema';
import mongoose, { Model, Types } from 'mongoose';

@Injectable()
export class WorkspaceService {
  constructor(
    @InjectModel(WorkSpace.name) private workSpaceModel: Model<WorkSpace>,
  ) {}

  isOwner(id: string, userId: any) {
    return this.workSpaceModel.findOne({ owner: userId, _id: id });
  }
  findSharedWorkSpaces(userId: any) {
    console.log(userId);
    return this.workSpaceModel.aggregate([
      //Get the workspace
      { $match: { members: new mongoose.Types.ObjectId(userId) } },
      //Lookup members
      {
        $lookup: {
          from: 'members',
          localField: 'memberId',
          foreignField: 'members',
          as: 'members',
          //Get member which match workspaceId
          pipeline: [
            //Lookup the user using memberId
            {
              $lookup: {
                from: 'users',
                localField: 'memberId',
                foreignField: '_id',
                as: 'user',
                //Pipeline for user
                pipeline: [
                  //Get specific field of user
                  {
                    $project: {
                      username: 1,
                      email: 1,
                      avatar: 1,
                    },
                  },
                ],
              },
            },
            { $unwind: '$user' },
            //Get the specific field of members
            {
              $project: {
                user: 1,
                role: 1,
                status: 1,
              },
            },
          ],
        },
      },
    ]);
  }
  findMyWorkSpaces(_id: string) {
    return this.workSpaceModel.aggregate([
      //Get the workspace
      { $match: { owner: new mongoose.Types.ObjectId(_id) } },
      //Lookup members
      {
        $lookup: {
          from: 'members',
          localField: 'memberId',
          foreignField: 'members',
          as: 'members',
          //Get member which match workspaceId
          pipeline: [
            //Lookup the user using memberId
            {
              $lookup: {
                from: 'users',
                localField: 'memberId',
                foreignField: '_id',
                as: 'user',
                //Pipeline for user
                pipeline: [
                  //Get specific field of user
                  {
                    $project: {
                      username: 1,
                      email: 1,
                      avatar: 1,
                    },
                  },
                ],
              },
            },
            { $unwind: '$user' },
            //Get the specific field of members
            {
              $project: {
                user: 1,
                role: 1,
                status: 1,
              },
            },
          ],
        },
      },
    ]);
  }

  create(createWorkspaceDto: CreateWorkspaceDto) {
    return this.workSpaceModel.create(createWorkspaceDto);
  }

  findAll() {
    return `This action returns all workspace`;
  }

  findOne(id: string) {
    return this.workSpaceModel.aggregate([
      //Get the workspace
      // { $match: { _id: new mongoose.Types.ObjectId(id) } },
      //Lookup members
      {
        $lookup: {
          from: 'members',
          localField: 'memberId',
          foreignField: 'members',
          as: 'members',
          //Get member which match workspaceId
          pipeline: [
            {
              $match: {
                workspaceId: new mongoose.Types.ObjectId(id), // Match workspaceId from document
              },
            },
            //Lookup the user using memberId
            {
              $lookup: {
                from: 'users',
                localField: 'memberId',
                foreignField: '_id',
                as: 'user',
                //Pipeline for user
                pipeline: [
                  //Get specific field of user
                  {
                    $project: {
                      username: 1,
                      email: 1,
                      avatar: 1,
                    },
                  },
                ],
              },
            },
            { $unwind: '$user' },
            //Get the specific field of members
            {
              $project: {
                user: 1,
                role: 1,
                status: 1,
              },
            },
          ],
        },
      },
    ]);
  }

  update(id: number, updateWorkspaceDto: UpdateWorkspaceDto) {
    return `This action updates a #${id} workspace`;
  }

  remove(id: number) {
    return `This action removes a #${id} workspace`;
  }

  //Add member to workspaces
  addMember(id: string, memberId: string) {
    return this.workSpaceModel.findByIdAndUpdate(
      { _id: id },
      { $push: { members: new mongoose.Types.ObjectId(memberId) } },
      { new: true },
    );
  }

  isExist(id: string) {
    return this.workSpaceModel.exists({ _id: id });
  }
}
