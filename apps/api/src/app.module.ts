import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ContentModule } from './content/content.module';
import { PrismaModule } from './prisma/prisma.module';

@Module({
  imports: [PrismaModule, ContentModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
