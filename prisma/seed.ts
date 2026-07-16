import { PrismaClient } from './generated/client.js';

const prisma = new (PrismaClient as any)();

async function main(): Promise<void> {
  console.log('🌱 Starting seed...');

  // Create admin user (password will be handled by BetterAuth)
  const adminUser = await prisma.user.upsert({
    where: { email: 'admin@example.com' },
    update: {},
    create: {
      name: 'Admin',
      email: 'admin@example.com',
      emailVerified: true,
      role: 'admin',
    },
  });

  console.log(`✅ Admin user created: ${adminUser.email}`);
  console.log('🌱 Seed completed.');
}

main()
  .catch((e: unknown) => {
    console.error('❌ Seed failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
