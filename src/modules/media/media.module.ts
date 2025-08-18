import { Module } from '@nestjs/common';
import { MediaController } from './controllers/v1/media.controller';
import { MediaService } from './services/media.service';
import { MediaRepository } from './repositories/media.repository';
import { PrismaService } from '../../common/providers/prisma.service';
import { StorageProviderService } from '../../common/providers/storage-provider.service';

@Module({
  controllers: [MediaController],
  providers: [
    MediaService,
    MediaRepository,
    PrismaService,
    StorageProviderService,
  ],
  exports: [MediaService, MediaRepository],
})
export class MediaModule {}
