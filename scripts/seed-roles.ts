import { PrismaService } from 'src/common/providers/prisma.service';
import { RoleName } from '@prisma/client';
import { Logger } from '@nestjs/common';

export async function seedRoles(prisma: PrismaService): Promise<void> {
  const logger = new Logger('SeedRoles');
  await prisma.role.upsert({
    where: { name: RoleName.user },
    update: {},
    create: { name: RoleName.user },
  });
  await prisma.role.upsert({
    where: { name: RoleName.admin },
    update: {},
    create: { name: RoleName.admin },
  });
  logger.log('Roles seeded successfully');
}
