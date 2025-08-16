import { execSync } from 'child_process';
import { PrismaService } from '../src/common/providers/prisma.service';
import { seedRoles } from './seed-roles';

async function main() {
  try {
    // Sync schema with MongoDB
    console.log('Syncing schema with npx prisma db push...');
    execSync('npx prisma db push', { stdio: 'inherit' });

    // Seed roles
    const prisma = new PrismaService();
    await seedRoles(prisma);
    await prisma.$disconnect();
    console.log('Database seeding completed successfully');
  } catch (error) {
    console.error('Error during seeding:', error);
    process.exit(1);
  }
}

main();
