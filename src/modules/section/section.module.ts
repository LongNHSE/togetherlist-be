import { Module } from '@nestjs/common';
import { SectionService } from './section.service';
import { SectionController } from './section.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Section, sectionSchema } from './schema/section.schema';

@Module({
  controllers: [SectionController],
  imports: [
    MongooseModule.forFeature([{ name: Section.name, schema: sectionSchema }]),
  ],
  providers: [SectionService],
})
export class SectionModule {}
