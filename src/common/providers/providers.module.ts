import { Global, Module } from '@nestjs/common';
import { MailService } from './mail-provider.service'; // adjust path
import { PrismaService } from './prisma.service';

@Global()
@Module({
  providers: [MailService, PrismaService],
  exports: [MailService, PrismaService], // export to use in other modules
})
export class ServicesModule {}
