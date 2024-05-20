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
  UseGuards,
} from '@nestjs/common';
import { WorkspaceService } from './workspace.service';
import { CreateWorkspaceDto } from './dto/create-workspace.dto';
import { UpdateWorkspaceDto } from './dto/update-workspace.dto';
import { apiSuccess, apiFailed } from 'src/common/api-response';
import { AuthGuard } from '@nestjs/passport';
import { GetUser } from 'src/common/decorator/user.decorator';
import { MemberService } from '../member/member.service';
import { CreateMemberDto } from '../member/dto/create-member.dto';
import { User } from '../user/schema/user.schema';

@Controller('workspaces')
export class WorkspaceController {
  constructor(
    private readonly workspaceService: WorkspaceService,
    private readonly memberService: MemberService,
  ) {}

  @Post()
  @UseGuards(AuthGuard('jwt'))
  @UsePipes(
    new ValidationPipe({ whitelist: true, skipMissingProperties: true }),
  )
  async create(
    @Body() createWorkspaceDto: CreateWorkspaceDto,
    //Custom decorator to get the user who is logged in
    @GetUser() user: any,
  ) {
    //The recent user who is logged in will be the owner of the workspace
    createWorkspaceDto.owner = user.userId;
    try {
      const result = await this.workspaceService.create(createWorkspaceDto);
      if (result) {
        return apiSuccess(200, result, 'Create workspace successfully');
      } else {
        return apiFailed(400, 'Create workspace failed');
      }
    } catch (error) {
      return error;
    }
  }

  @Post(':id/members')
  @UseGuards(AuthGuard('jwt'))
  @UsePipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
    }),
  )
  async addMember(
    @Param('id') id: string,
    @Body() members: CreateMemberDto,
    @GetUser() user: any,
  ) {
    try {
      const isExist = await this.workspaceService.isExist(id);
      if (!isExist) {
        return apiFailed(400, 'Workspace not found');
      }
      const isOwner = await this.workspaceService.isOwner(id, user.userId);
      if (!isOwner) {
        return apiFailed(400, `You don't have permission`);
      }
      const result = await this.memberService.create(id, members.members);
      if (result) {
        const memberId = result.map((member) => member._id);
        const workspace = await this.workspaceService.addMember(id, memberId);
        if (workspace) {
          return apiSuccess(200, workspace, 'Add member successfully');
        } else {
          return apiFailed(400, 'Add member failed');
        }
      } else {
        return apiFailed(400, 'Add member failed');
      }
    } catch (error) {
      return error;
    }
  }

  @Get()
  async findAll() {
    try {
      const result = await this.workspaceService.findAll();
      if (result) {
        return apiSuccess(200, result, 'Get all workspaces successfully');
      } else {
        return apiFailed(400, 'Get all workspace failed');
      }
    } catch (error) {
      console.log(error);
      return apiFailed(400, 'Get all workspace failed');
    }
  }

  //Get all personal workspace based on who logged in
  @Get('me')
  @UseGuards(AuthGuard('jwt'))
  async findMyWorkSpace(@GetUser() user: any) {
    try {
      const result = await this.workspaceService.findMyWorkSpaces(user.userId);
      if (result) {
        return apiSuccess(200, result, 'Get workspaces successfully');
      } else {
        return apiFailed(400, 'Get workspace failed');
      }
    } catch (error) {
      console.log(error);
      return apiFailed(400, 'Get workspace failed');
    }
  }

  //Get all shared workspace based on who logged in
  @Get('me/share')
  @UseGuards(AuthGuard('jwt'))
  async findSharedWorkSpace(@GetUser() user: any) {
    try {
      const result = await this.workspaceService.findSharedWorkSpaces(
        user.userId,
      );
      if (result) {
        return apiSuccess(200, result, 'Get workspaces successfully');
      } else {
        return apiFailed(400, 'Get workspace failed');
      }
    } catch (error) {
      console.log(error);
      return apiFailed(400, 'Get workspace failed');
    }
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return await this.workspaceService.findOne(id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateWorkspaceDto: UpdateWorkspaceDto,
  ) {
    return this.workspaceService.update(+id, updateWorkspaceDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.workspaceService.remove(+id);
  }
}
