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
import { UpdateBoardDto } from './dto/update-board.dto';
import { AuthGuard } from '@nestjs/passport';
import { SectionService } from '../section/section.service';
import { apiFailed, apiSuccess } from 'src/common/api-response';
import { WorkspaceService } from '../workspace/workspace.service';

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
      const defaultSection = await this.sectionService.createDefaultSection();
      if (defaultSection) {
        createBoardDto.sections = [defaultSection._id.toString()];
        const result = await this.boardService.create(createBoardDto);
        if (result) {
          await this.workspaceService.addBoardToWorkspace(
            result._id,
            result.workspace,
          );
          return apiSuccess(200, { result }, 'Create board successfully');
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
  findOne(@Param('id') id: string) {
    return this.boardService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateBoardDto: UpdateBoardDto) {
    return this.boardService.update(+id, updateBoardDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.boardService.remove(+id);
  }
}
