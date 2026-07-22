import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateContentDto } from './dto/create-content.dto';
import { UpdateContentDto } from './dto/update-content.dto';
import { ContentEntity } from './entities/content.entity';

@Injectable()
export class ContentService {
  constructor(private readonly prisma: PrismaService) {}

  async create(dto: CreateContentDto): Promise<ContentEntity> {
    const created = await this.prisma.content.create({
      data: {
        title: dto.title,
        summary: dto.summary,
        body: dto.body,
        channel: dto.channel,
        tags: dto.tags ?? [],
      },
    });

    return this.toEntity(created);
  }

  async findAll(channel?: 'linkedin' | 'medium'): Promise<ContentEntity[]> {
    const rows = await this.prisma.content.findMany({
      where: channel ? { channel } : undefined,
      orderBy: { updatedAt: 'desc' },
    });

    return rows.map((row) => this.toEntity(row));
  }

  async findOne(id: string): Promise<ContentEntity> {
    const item = await this.prisma.content.findUnique({ where: { id } });
    if (!item) {
      throw new NotFoundException(`Content with id ${id} not found`);
    }
    return this.toEntity(item);
  }

  async update(id: string, dto: UpdateContentDto): Promise<ContentEntity> {
    await this.ensureExists(id);

    const item = await this.prisma.content.update({
      where: { id },
      data: {
        title: dto.title,
        summary: dto.summary,
        body: dto.body,
        channel: dto.channel,
        tags: dto.tags,
      },
    });

    return this.toEntity(item);
  }

  async remove(id: string): Promise<{ deleted: true; id: string }> {
    await this.ensureExists(id);
    await this.prisma.content.delete({ where: { id } });
    return { deleted: true, id };
  }

  private async ensureExists(id: string): Promise<void> {
    const existing = await this.prisma.content.findUnique({ where: { id } });
    if (!existing) {
      throw new NotFoundException(`Content with id ${id} not found`);
    }
  }

  private toEntity(row: {
    id: string;
    title: string;
    summary: string;
    body: string;
    channel: 'linkedin' | 'medium';
    tags: unknown;
    createdAt: Date;
    updatedAt: Date;
  }): ContentEntity {
    return {
      id: row.id,
      title: row.title,
      summary: row.summary,
      body: row.body,
      channel: row.channel,
      tags: Array.isArray(row.tags) ? (row.tags.filter((tag) => typeof tag === 'string') as string[]) : [],
      createdAt: row.createdAt.toISOString(),
      updatedAt: row.updatedAt.toISOString(),
    };
  }
}
