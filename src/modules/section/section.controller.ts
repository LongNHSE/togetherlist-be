import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { SectionService } from './section.service';
import { CreateSectionDto } from './dto/create-section.dto';
import { UpdateSectionDto } from './dto/update-section.dto';
import { apiSuccess, apiFailed } from 'src/common/api-response';

@Controller('sections')
export class SectionController {
  constructor(private readonly sectionService: SectionService) {}

  @Post()
  create(@Body() createSectionDto: CreateSectionDto) {
    return this.sectionService.create(createSectionDto);
  }

  @Get()
  findAll() {
    return this.sectionService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.sectionService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateSectionDto: UpdateSectionDto) {
    return this.sectionService.update(+id, updateSectionDto);
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    try {
      const result = await this.sectionService.remove(id);
      if (result) {
        return apiSuccess(200, result, 'Delete section successfully');
      } else {
        return apiFailed(400, {}, 'Delete section failed');
      }
    } catch (error) {
      console.log(error);
    }
  }
}
