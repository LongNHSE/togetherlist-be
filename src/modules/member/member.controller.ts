import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
} from '@nestjs/common';
import { MemberService } from './member.service';
import { CreateMemberDto } from './dto/create-member.dto';
import { UpdateMemberDto } from './dto/update-member.dto';
import { AuthGuard } from '@nestjs/passport';
import { GetUser } from '../auth/decorator';
import { apiFailed, apiSuccess } from 'src/common/api-response';
import { WorkspaceService } from '../workspace/workspace.service';

@Controller('members')
export class MemberController {
  constructor(
    private readonly memberService: MemberService,
    private readonly workSpaceService: WorkspaceService,
  ) {}

  // @Post()
  // create(@Body() createMemberDto: CreateMemberDto[]) {
  //   return '';
  // }

  @Post(':id')
  @UseGuards(AuthGuard('jwt'))
  async handleInvite(
    @Param('id') _id: string,
    @GetUser() user: any,
    @Body() status: boolean,
  ) {
    try {
      const invite = await this.memberService.findOne(_id);
      if (!invite) {
        return apiFailed(400, 'Invite not found');
      }
      if (invite.status.toLocaleLowerCase() !== 'invited') {
        return apiFailed(400, 'Accept invite failed');
      }

      const result = await this.memberService.acceptInvite(
        _id,
        user.userId,
        status,
      );
      if (result) {
        const workspace = await this.workSpaceService.addMember(
          result.workspaceId,
          user.userId,
        );
        if (workspace) {
          return apiSuccess(200, workspace, 'Add member successfully');
        } else {
          return apiFailed(400, 'Add member failed');
        }
      } else {
        return apiFailed(400, 'Accept invite failed');
      }
    } catch (error) {
      console.log(error);
      return apiFailed(400, 'Accept invite failed');
    }
  }
  @Get()
  async findAll(@Body() workspaceId: any) {
    console.log(workspaceId);
    return await this.memberService.findAll(workspaceId.workspaceId);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.memberService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateMemberDto: UpdateMemberDto) {
    return this.memberService.update(+id, updateMemberDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.memberService.remove(+id);
  }
}
