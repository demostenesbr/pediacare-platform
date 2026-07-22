import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsIn, IsOptional, IsString, MaxLength, MinLength } from 'class-validator';

export class CreateContentDto {
  @ApiProperty({ example: 'Como usar agentes de IA em uma stack moderna' })
  @IsString()
  @MinLength(5)
  @MaxLength(120)
  title: string;

  @ApiProperty({ example: 'Resumo para abertura do artigo no LinkedIn e Medium.' })
  @IsString()
  @MinLength(10)
  @MaxLength(280)
  summary: string;

  @ApiProperty({ example: 'Conteudo completo com objetivo, arquitetura e proximos passos.' })
  @IsString()
  @MinLength(20)
  body: string;

  @ApiProperty({ enum: ['linkedin', 'medium'], example: 'linkedin' })
  @IsIn(['linkedin', 'medium'])
  channel: 'linkedin' | 'medium';

  @ApiProperty({ example: ['ia', 'nestjs', 'nextjs'], required: false })
  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  tags?: string[];
}
