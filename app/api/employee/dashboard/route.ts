import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getAuthToken, verifyToken } from '@/lib/auth';

export async function GET(request: NextRequest) {
  try {
    const token = await getAuthToken();
    const payload = token ? verifyToken(token) : null;
    if (!payload) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const userId = payload.userId;

    const completedTokens = await prisma.token.count({
      where: { assignedTo: userId, status: 'done' },
    });

    const activeTokens = await prisma.token.count({
      where: { assignedTo: userId, status: { in: ['open', 'in_progress'] } },
    });

    const projectsCount = await prisma.projectMember.count({
      where: { userId },
    });

    const memberships = await prisma.projectMember.findMany({
      where: { userId },
      include: {
        project: {
          include: {
            _count: { select: { tokens: true } },
            tokens: { where: { status: 'done' }, select: { id: true } },
          },
        },
      },
    });

    const assignedProjects = memberships.map(({ project }) => ({
      id: project.id,
      name: project.name,
      status: project.status,
      progress: project.status === 'planning' ? 0 : (project._count.tokens > 0
        ? Math.round((project.tokens.length / project._count.tokens) * 100)
        : 0),
    }));

    const userProjectIds = memberships.map(m => m.projectId);

    const recentActivity = await prisma.token.findMany({
      where: { projectId: { in: userProjectIds } },
      include: {
        project: { select: { name: true } },
      },
      orderBy: { updatedAt: 'desc' },
      take: 5,
    });

    return NextResponse.json({
      completedTokens,
      activeTokens,
      projectsCount,
      assignedProjects,
      recentActivity: recentActivity.map(t => ({
        title: t.title,
        projectName: t.project.name,
        status: t.status,
        updatedAt: t.updatedAt,
      })),
    });
  } catch {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
