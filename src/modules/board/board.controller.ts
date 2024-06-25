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
import { BoardService } from './board.service';
import { CreateBoardDto } from './dto/create-board.dto';
import { AuthGuard } from '@nestjs/passport';
import { SectionService } from '../section/section.service';
import { apiFailed, apiSuccess } from 'src/common/api-response';
import { WorkspaceService } from '../workspace/workspace.service';
import { UpdateBoardStatusDto } from './dto/update-board-status.dto';
import { CreateBoardStatusDto } from './dto/create-board-status.dto';
import { Types } from 'mongoose';

@Controller('boards')
export class BoardController {
  constructor(
    private readonly boardService: BoardService,
    private readonly sectionService: SectionService,
    private readonly workspaceService: WorkspaceService,
  ) {}

  @Post()
  @UsePipes(new ValidationPipe())
  @UseGuards(AuthGuard('jwt'))
  async create(@Body() createBoardDto: CreateBoardDto) {
    try {
      const defaultSection = await this.sectionService.createDefaultSection(
        createBoardDto.workspace,
      );
      if (defaultSection) {
        createBoardDto.sections = [defaultSection._id.toString()];
        const result = await this.boardService.create(createBoardDto);
        if (result) {
          await this.sectionService.updateBoardId(
            defaultSection._id,
            result._id as Types.ObjectId,
          );
          await this.workspaceService.addBoardToWorkspace(
            result._id as Types.ObjectId,
            result.workspace,
          );
          return apiSuccess(200, result, 'Create board successfully');
        } else {
          return apiFailed(400, {}, 'Create board failed');
        }
      }
    } catch (error) {
      console.log(error);
      return apiFailed(400, {}, 'Create board failed');
    }
  }

  @Get()
  findAll() {
    return this.boardService.findAll();
  }

  @Get('workspaces/:workspaceId')
  async findBoardsByWorkspaceId(@Param('workspaceId') workspaceId: string) {
    try {
      const boards =
        await this.boardService.findBoardsByWorkspaceId(workspaceId);
      return apiSuccess(200, boards, 'Get boards successfully');
    } catch (error) {
      console.log(error);
      return apiFailed(400, {}, 'Get boards failed');
    }
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    try {
      const board = await this.boardService.findOne(id);
      if (board) {
        return apiSuccess(200, board[0], 'Get board successfully');
      } else {
        return apiFailed(400, {}, 'Get board failed');
      }
    } catch (error) {
      console.log(error);
      return apiFailed(400, {}, 'Get board failed');
    }
  }

  // @Patch(':id')
  // update(@Param('id') id: string, @Body() updateBoardDto: UpdateBoardDto) {
  //  return this.boardService.update(id, updateBoardDto);
  // }

  @Post(':id/board-status')
  async addNewStatus(
    @Param('id') id: string,
    @Body() status: CreateBoardStatusDto,
  ) {
    try {
      const result = await this.boardService.addNewStatus(id, status);
      if (result) {
        return apiSuccess(200, result, 'Add new status successfully');
      } else {
        return apiFailed(400, {}, 'Add new status failed');
      }
    } catch (error) {
      console.log(error);
      return apiFailed(400, {}, 'Add new status failed');
    }
  }

  @Patch(':id/board-status/:statusId')
  async updateBoardStatus(
    @Param('id') id: string,
    @Param('statusId') statusId: string,
    @Body() updateBoardStatusDto: UpdateBoardStatusDto,
  ) {
    try {
      const result = await this.boardService.updateBoardStatus(
        id,
        statusId,
        updateBoardStatusDto,
      );
      if (result) {
        return apiSuccess(200, result, 'Update board status successfully');
      } else {
        return apiFailed(400, {}, 'Update board status failed');
      }
    } catch (error) {
      console.log(error);
      return apiFailed(400, {}, 'Update board status failed');
    }
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    try {
      const result = await this.boardService.remove(id);
      if (result) {
        console.log(result);
        await this.workspaceService.removeBoardFromWorkspace(
          result.workspace as string,
          id,
        );
        return apiSuccess(200, result, 'Delete board successfully');
      } else {
        return apiFailed(400, {}, 'Delete board failed');
      }
    } catch (error) {
      console.log(error);
      return apiFailed(400, {}, 'Delete board failed');
    }
  }
}
