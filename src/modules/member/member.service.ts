import { Injectable } from '@nestjs/common';
import { CreateMemberDto } from './dto/create-member.dto';
import { UpdateMemberDto } from './dto/update-member.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Member } from './schema/member.schema';
import mongoose, { Model } from 'mongoose';
import { NestedCreateMemberDto } from './dto/nested-create-member.dto';

@Injectable()
export class MemberService {
  constructor(@InjectModel(Member.name) private memberModel: Model<Member>) {}

  async create(
    workspaceId: string,
    createMemberDto: NestedCreateMemberDto[],
  ): Promise<Member[]> {
    const memberPromises = createMemberDto.map(async (member) => {
      member.workspaceId = workspaceId;
      return await this.memberModel.create(member);
    });
    return Promise.all(memberPromises);
  }

  createWithEmail(workspaceId: string, memberId: string) {
    return this.memberModel.create({
      workspaceId,
      memberId,
      status: 'accepted',
    });
  }

  createOwner(member: any) {
    return this.memberModel.create(member);
  }

  acceptInvite(_id: string, userId: any, status: boolean) {
    let statusString;
    if (status) {
      statusString = 'accepted';
    } else {
      statusString = 'rejected';
    }
    return this.memberModel.findByIdAndUpdate(
      _id,
      { status: statusString },
      { new: true },
    );
  }

  findAll(_id: string) {
    return this.memberModel.aggregate([
      { $match: { workspaceId: new mongoose.Types.ObjectId(_id) } },
      {
        $lookup: {
          from: 'users',
          localField: 'memberId',
          foreignField: '_id',
          as: 'member',
          pipeline: [
            {
              $project: {
                username: 1,
                email: 1,
                avatar: 1,
                firstName: 1,
                lastName: 1,
              },
            },
          ],
        },
      },
      { $unwind: '$member' },
    ]);
  }

  findOne(id: string) {
    return this.memberModel.findById({ _id: id });
  }

  update(id: number, updateMemberDto: UpdateMemberDto) {
    return `This action updates a #${id} member`;
  }

  remove(id: number) {
    return `This action removes a #${id} member`;
  }

  findSharedWorkspace(userId: string) {
    return this.memberModel.aggregate([
      {
        $match: {
          $and: [
            { memberId: new mongoose.Types.ObjectId(userId) },
            { status: 'accepted' },
          ],
        },
      },
      {
        $lookup: {
          from: 'workspaces',
          localField: 'workspaceId',
          foreignField: '_id',
          as: 'workspace',
        },
      },
      { $unwind: '$workspace' },
    ]);
  }
}
