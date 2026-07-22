import { Body, Controller, Delete, Get, Param, Patch, Post, Query } from '@nestjs/common';
import { ApiOperation, ApiQuery, ApiTags } from '@nestjs/swagger';
import { ContentService } from './content.service';
import { CreateContentDto } from './dto/create-content.dto';
import { UpdateContentDto } from './dto/update-content.dto';

@ApiTags('content')
@Controller('content')
export class ContentController {
  constructor(private readonly contentService: ContentService) {}

  @Post()
  @ApiOperation({ summary: 'Create content for LinkedIn/Medium' })
  async create(@Body() dto: CreateContentDto) {
    return this.contentService.create(dto);
  }

  @Get()
  @ApiOperation({ summary: 'List all content' })
  @ApiQuery({ name: 'channel', required: false, enum: ['linkedin', 'medium'] })
  async findAll(@Query('channel') channel?: 'linkedin' | 'medium') {
    return this.contentService.findAll(channel);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get one content item by id' })
  async findOne(@Param('id') id: string) {
    return this.contentService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update one content item by id' })
  async update(@Param('id') id: string, @Body() dto: UpdateContentDto) {
    return this.contentService.update(id, dto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete one content item by id' })
  async remove(@Param('id') id: string) {
    return this.contentService.remove(id);
  }
}
