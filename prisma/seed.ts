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

  return tag;
}

async function main() {
  const passwordHash = await hashPassword('admin123');

  const admin = await prisma.user.upsert({
    where: { email: 'admin@employeehub.com' },
    update: { role: 'admin' },
    create: { email: 'admin@employeehub.com', name: 'Admin', passwordHash, isActive: true, role: 'admin' },
  });

  const employee = await prisma.user.upsert({
    where: { email: 'employee@employeehub.com' },
    update: {},
    create: { email: 'employee@employeehub.com', name: 'Alex Rivera', passwordHash, isActive: true, role: 'employee' },
  });

  const sarah = await prisma.user.upsert({
    where: { email: 'sarah@employeehub.com' },
    update: {},
    create: { email: 'sarah@employeehub.com', name: 'Sarah Chen', passwordHash, isActive: true, role: 'manager' },
  });

  const marcus = await prisma.user.upsert({
    where: { email: 'marcus@employeehub.com' },
    update: {},
    create: { email: 'marcus@employeehub.com', name: 'Marcus Webb', passwordHash, isActive: true, role: 'manager' },
  });

  const elena = await prisma.user.upsert({
    where: { email: 'elena@employeehub.com' },
    update: {},
    create: { email: 'elena@employeehub.com', name: 'Elena Vasquez', passwordHash, isActive: true, role: 'employee' },
  });

  console.log('Users created');

  const [ceoTag, mgrTag, devTag, viewerTag, designTag] = await Promise.all([
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
    upsertTag('Design', '#7c3aed', 'Design team access', {
      users:    { canView: true, canCreate: false, canEdit: false, canDelete: false, canAssign: false },
      projects: { canView: true, canCreate: false, canEdit: true, canDelete: false, canAssign: false },
      tokens:   { canView: true, canCreate: true, canEdit: true, canDelete: false, canAssign: false },
      tags:     { canView: false, canCreate: false, canEdit: false, canDelete: false, canAssign: false },
    }),
  ]);

  if (admin && ceoTag) {
    await prisma.userTag.upsert({ where: { userId_tagId: { userId: admin.id, tagId: ceoTag.id } }, update: {}, create: { userId: admin.id, tagId: ceoTag.id } });
  }
  if (sarah && mgrTag) {
    await prisma.userTag.upsert({ where: { userId_tagId: { userId: sarah.id, tagId: mgrTag.id } }, update: {}, create: { userId: sarah.id, tagId: mgrTag.id } });
  }
  if (marcus && mgrTag) {
    await prisma.userTag.upsert({ where: { userId_tagId: { userId: marcus.id, tagId: mgrTag.id } }, update: {}, create: { userId: marcus.id, tagId: mgrTag.id } });
  }
  if (employee && devTag) {
    await prisma.userTag.upsert({ where: { userId_tagId: { userId: employee.id, tagId: devTag.id } }, update: {}, create: { userId: employee.id, tagId: devTag.id } });
  }
  if (elena && devTag) {
    await prisma.userTag.upsert({ where: { userId_tagId: { userId: elena.id, tagId: devTag.id } }, update: {}, create: { userId: elena.id, tagId: devTag.id } });
  }
  if (elena && designTag) {
    await prisma.userTag.upsert({ where: { userId_tagId: { userId: elena.id, tagId: designTag.id } }, update: {}, create: { userId: elena.id, tagId: designTag.id } });
  }

  console.log('Tags and user-tag assignments created');

  const now = new Date();
  const hyperion = await prisma.project.upsert({
    where: { id: 'seed-project-hyperion' },
    update: {},
    create: {
      id: 'seed-project-hyperion',
      name: 'Project Hyperion',
      description: 'Enterprise-grade cloud distribution engine for optimized microservice coordination and edge replication.',
      status: 'active',
      createdBy: sarah.id,
      createdAt: new Date(now.getTime() - 60 * 24 * 60 * 60 * 1000),
    },
  });

  const coreUI = await prisma.project.upsert({
    where: { id: 'seed-project-core-ui' },
    update: {},
    create: {
      id: 'seed-project-core-ui',
      name: 'Core Design System',
      description: 'Standardizing UI patterns across all products including light/dark templates and WCAG 2.1 auditing.',
      status: 'active',
      createdBy: marcus.id,
      createdAt: new Date(now.getTime() - 45 * 24 * 60 * 60 * 1000),
    },
  });

  const employeeHub = await prisma.project.upsert({
    where: { id: 'seed-project-employee-hub' },
    update: {},
    create: {
      id: 'seed-project-employee-hub',
      name: 'Employee Hub Platform',
      description: 'Internal workforce management platform replacing legacy Excel-based tracking.',
      status: 'planning',
      createdBy: admin.id,
      createdAt: new Date(now.getTime() - 14 * 24 * 60 * 60 * 1000),
    },
  });

  console.log('Projects created');

  await prisma.projectMember.upsert({ where: { projectId_userId: { projectId: hyperion.id, userId: sarah.id } }, update: {}, create: { projectId: hyperion.id, userId: sarah.id, role: 'manager' } });
  await prisma.projectMember.upsert({ where: { projectId_userId: { projectId: hyperion.id, userId: employee.id } }, update: {}, create: { projectId: hyperion.id, userId: employee.id, role: 'member' } });
  await prisma.projectMember.upsert({ where: { projectId_userId: { projectId: hyperion.id, userId: marcus.id } }, update: {}, create: { projectId: hyperion.id, userId: marcus.id, role: 'member' } });
  await prisma.projectMember.upsert({ where: { projectId_userId: { projectId: hyperion.id, userId: elena.id } }, update: {}, create: { projectId: hyperion.id, userId: elena.id, role: 'member' } });
  await prisma.projectMember.upsert({ where: { projectId_userId: { projectId: coreUI.id, userId: marcus.id } }, update: {}, create: { projectId: coreUI.id, userId: marcus.id, role: 'manager' } });
  await prisma.projectMember.upsert({ where: { projectId_userId: { projectId: coreUI.id, userId: employee.id } }, update: {}, create: { projectId: coreUI.id, userId: employee.id, role: 'member' } });
  await prisma.projectMember.upsert({ where: { projectId_userId: { projectId: coreUI.id, userId: elena.id } }, update: {}, create: { projectId: coreUI.id, userId: elena.id, role: 'member' } });
  await prisma.projectMember.upsert({ where: { projectId_userId: { projectId: employeeHub.id, userId: admin.id } }, update: {}, create: { projectId: employeeHub.id, userId: admin.id, role: 'manager' } });
  await prisma.projectMember.upsert({ where: { projectId_userId: { projectId: employeeHub.id, userId: employee.id } }, update: {}, create: { projectId: employeeHub.id, userId: employee.id, role: 'member' } });
  await prisma.projectMember.upsert({ where: { projectId_userId: { projectId: employeeHub.id, userId: sarah.id } }, update: {}, create: { projectId: employeeHub.id, userId: sarah.id, role: 'member' } });

  console.log('Project members created');

  const tokensData = [
    { projectId: hyperion.id, title: 'Refactor API Middleware', description: 'Optimize request handling for high-concurrency clusters in the authentication service pipeline.', status: 'in_progress' as const, priority: 'high' as const, raisedBy: sarah.id, assignedTo: employee.id, startedAt: new Date(now.getTime() - 2 * 60 * 60 * 1000) },
    { projectId: hyperion.id, title: 'Implement API Throttling for Batch-Z', description: 'Protect regional node boundaries with custom dynamic IP leak parameters.', status: 'open' as const, priority: 'high' as const, raisedBy: sarah.id },
    { projectId: hyperion.id, title: 'WebSocket Connection Heartbeats', description: 'Maintain stable continuous sync loops without standard reconnect crashes.', status: 'in_progress' as const, priority: 'medium' as const, raisedBy: marcus.id, assignedTo: elena.id, startedAt: new Date(now.getTime() - 4 * 60 * 60 * 1000) },
    { projectId: hyperion.id, title: 'Database Connection Pooling', description: 'Implement connection pooling for production database tier.', status: 'done' as const, priority: 'high' as const, raisedBy: sarah.id, assignedTo: employee.id, startedAt: new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000), completedAt: new Date(now.getTime() - 2 * 24 * 60 * 60 * 1000) },
    { projectId: hyperion.id, title: 'Unit Test Coverage', description: 'Achieve 80% unit test coverage on core services.', status: 'in_progress' as const, priority: 'medium' as const, raisedBy: marcus.id, assignedTo: employee.id, startedAt: new Date(now.getTime() - 24 * 60 * 60 * 1000) },
    { projectId: coreUI.id, title: 'Accessibility Audit', description: 'Verify WCAG 2.1 compliance across active design variables.', status: 'open' as const, priority: 'medium' as const, raisedBy: marcus.id },
    { projectId: coreUI.id, title: 'Design Token Migration', description: 'Migrate legacy color tokens to new design system.', status: 'open' as const, priority: 'low' as const, raisedBy: marcus.id },
    { projectId: coreUI.id, title: 'Component Library Documentation', description: 'Document all components with usage examples and prop definitions.', status: 'done' as const, priority: 'medium' as const, raisedBy: elena.id, assignedTo: employee.id, startedAt: new Date(now.getTime() - 14 * 24 * 60 * 60 * 1000), completedAt: new Date(now.getTime() - 5 * 24 * 60 * 60 * 1000) },
    { projectId: coreUI.id, title: 'Dark Mode Implementation', description: 'Implement dark mode variant for all core components.', status: 'open' as const, priority: 'high' as const, raisedBy: elena.id },
    { projectId: employeeHub.id, title: 'User Authentication Flow', description: 'Implement login/register with email or phone.', status: 'open' as const, priority: 'high' as const, raisedBy: admin.id },
    { projectId: employeeHub.id, title: 'Role-Based Access Control', description: 'Implement RBAC with tag-based permission system.', status: 'open' as const, priority: 'high' as const, raisedBy: admin.id },
    { projectId: employeeHub.id, title: 'Dashboard Wireframes', description: 'Create wireframes for employee and executive dashboards.', status: 'open' as const, priority: 'medium' as const, raisedBy: sarah.id },
  ];

  for (const t of tokensData) {
    await prisma.token.upsert({
      where: { id: `seed-token-${t.title.toLowerCase().replace(/\s+/g, '-')}` },
      update: {},
      create: {
        id: `seed-token-${t.title.toLowerCase().replace(/\s+/g, '-')}`,
        projectId: t.projectId,
        title: t.title,
        description: t.description,
        status: t.status,
        priority: t.priority,
        raisedBy: t.raisedBy,
        assignedTo: t.assignedTo || null,
        startedAt: t.startedAt || null,
        completedAt: t.completedAt || null,
      },
    });
  }

  const tokenCount = await prisma.token.count();
  const projectCount = await prisma.project.count();
  const memberCount = await prisma.projectMember.count();
  console.log(`\n${projectCount} projects, ${memberCount} project members, ${tokenCount} tokens`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
