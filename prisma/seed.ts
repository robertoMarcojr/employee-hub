import { PrismaClient } from '../lib/generated/prisma/client';
import { Pool } from 'pg';
import { PrismaPg } from '@prisma/adapter-pg';
import { hashPassword } from '../lib/auth';
import * as dotenv from 'dotenv';

dotenv.config();

const connectionString = process.env.DIRECT_URL || process.env.DATABASE_URL || '';
const pool = new Pool({ connectionString });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

const RESOURCES = ['users', 'projects', 'tokens', 'tags'];
const PERM_BITS = ['canView', 'canCreate', 'canEdit', 'canDelete', 'canAssign'] as const;

type PermMap = Record<string, Record<string, boolean>>;

async function upsertTag(name: string, color: string, description: string, permissions: PermMap) {
  const tag = await prisma.tag.upsert({
    where: { name },
    update: { color, description },
    create: { name, color, description },
  });

  for (const resource of RESOURCES) {
    const perms = permissions[resource];
    if (!perms) continue;
    await prisma.permission.upsert({
      where: { tagId_resource: { tagId: tag.id, resource } },
      update: { canView: perms.canView ?? false, canCreate: perms.canCreate ?? false, canEdit: perms.canEdit ?? false, canDelete: perms.canDelete ?? false, canAssign: perms.canAssign ?? false },
      create: { tagId: tag.id, resource, canView: perms.canView ?? false, canCreate: perms.canCreate ?? false, canEdit: perms.canEdit ?? false, canDelete: perms.canDelete ?? false, canAssign: perms.canAssign ?? false },
    });
  }

  console.log(`Tag "${name}" synced with ${Object.keys(permissions).length} resource permissions`);
  return tag;
}

async function main() {
  const passwordHash = await hashPassword('admin123');

  await prisma.user.upsert({
    where: { email: 'admin@employeehub.com' },
    update: { role: 'admin' },
    create: { email: 'admin@employeehub.com', name: 'Admin', passwordHash, isActive: true, role: 'admin' },
  });

  await prisma.user.upsert({
    where: { email: 'employee@employeehub.com' },
    update: {},
    create: { email: 'employee@employeehub.com', name: 'Employee', passwordHash, isActive: true, role: 'employee' },
  });

  console.log('Users created: admin@employeehub.com / admin123 (admin), employee@employeehub.com / admin123 (employee)');

  await Promise.all([
    upsertTag('CEO', '#722f37', 'Full system access', {
      users:    { canView: true, canCreate: true, canEdit: true, canDelete: true, canAssign: true },
      projects: { canView: true, canCreate: true, canEdit: true, canDelete: true, canAssign: true },
      tokens:   { canView: true, canCreate: true, canEdit: true, canDelete: true, canAssign: true },
      tags:     { canView: true, canCreate: true, canEdit: true, canDelete: true, canAssign: true },
    }),
    upsertTag('Manager', '#b28a52', 'Can manage projects and team', {
      users:    { canView: true, canCreate: false, canEdit: true, canDelete: false, canAssign: true },
      projects: { canView: true, canCreate: true, canEdit: true, canDelete: false, canAssign: true },
      tokens:   { canView: true, canCreate: true, canEdit: true, canDelete: false, canAssign: true },
      tags:     { canView: true, canCreate: false, canEdit: false, canDelete: false, canAssign: false },
    }),
    upsertTag('Developer', '#2d6a4f', 'Can work on assigned tokens', {
      users:    { canView: true, canCreate: false, canEdit: false, canDelete: false, canAssign: false },
      projects: { canView: true, canCreate: false, canEdit: false, canDelete: false, canAssign: false },
      tokens:   { canView: true, canCreate: true, canEdit: true, canDelete: false, canAssign: false },
      tags:     { canView: false, canCreate: false, canEdit: false, canDelete: false, canAssign: false },
    }),
    upsertTag('Viewer', '#6b7280', 'Read-only access', {
      users:    { canView: true, canCreate: false, canEdit: false, canDelete: false, canAssign: false },
      projects: { canView: true, canCreate: false, canEdit: false, canDelete: false, canAssign: false },
      tokens:   { canView: true, canCreate: false, canEdit: false, canDelete: false, canAssign: false },
      tags:     { canView: false, canCreate: false, canEdit: false, canDelete: false, canAssign: false },
    }),
  ]);

  const tagCount = await prisma.tag.count();
  const permCount = await prisma.permission.count();
  console.log(`\n${tagCount} tags, ${permCount} permission rules`);

  const admin = await prisma.user.findUnique({ where: { email: 'admin@employeehub.com' } });
  const employee = await prisma.user.findUnique({ where: { email: 'employee@employeehub.com' } });
  const ceoTag = await prisma.tag.findUnique({ where: { name: 'CEO' } });
  const devTag = await prisma.tag.findUnique({ where: { name: 'Developer' } });

  if (admin && ceoTag) {
    await prisma.userTag.upsert({
      where: { userId_tagId: { userId: admin.id, tagId: ceoTag.id } },
      update: {},
      create: { userId: admin.id, tagId: ceoTag.id },
    });
  }

  if (employee && devTag) {
    await prisma.userTag.upsert({
      where: { userId_tagId: { userId: employee.id, tagId: devTag.id } },
      update: {},
      create: { userId: employee.id, tagId: devTag.id },
    });
  }
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
