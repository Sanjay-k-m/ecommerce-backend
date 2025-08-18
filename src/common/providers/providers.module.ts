import { Global, Module } from '@nestjs/common';
import { MailService } from './mail-provider.service'; // adjust path
import { PrismaService } from './prisma.service';
import { StorageProviderService } from './storage-provider.service';

@Global()
@Module({
  providers: [MailService, PrismaService, StorageProviderService],
  exports: [MailService, PrismaService, StorageProviderService], // export to use in other modules
})
export class ServicesModule {}
