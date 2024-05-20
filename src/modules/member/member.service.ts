import { Injectable } from '@nestjs/common';
import { CreateMemberDto } from './dto/create-member.dto';
import { UpdateMemberDto } from './dto/update-member.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Member } from './schema/member.schema';
import { Model } from 'mongoose';
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

  findAll() {
    return `This action returns all member`;
  }

  findOne(id: number) {
    return `This action returns a #${id} member`;
  }

  update(id: number, updateMemberDto: UpdateMemberDto) {
    return `This action updates a #${id} member`;
  }

  remove(id: number) {
    return `This action removes a #${id} member`;
  }

  findSharedWorkspace(userId: string) {}
}
