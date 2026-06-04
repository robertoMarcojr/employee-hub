import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getAuthToken, verifyToken } from '@/lib/auth';

export async function GET() {
  try {
    const token = await getAuthToken();
    const payload = token ? verifyToken(token) : null;
    if (!payload) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    if (payload.role !== 'admin' && payload.role !== 'executive') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const projects = await prisma.project.findMany({
      include: {
        _count: { select: { members: true } },
        tokens: { select: { status: true } },
      },
      orderBy: { createdAt: 'desc' },
    });

    const totalProjects = projects.length;

    const memberUserIds = new Set<string>();
    for (const p of projects) {
      const members = await prisma.projectMember.findMany({
        where: { projectId: p.id },
        select: { userId: true },
      });
      members.forEach(m => memberUserIds.add(m.userId));
    }
    const totalMembers = memberUserIds.size;

    let activeTokens = 0;
    let completedTokens = 0;
    const projectList = projects.map(p => {
      const open = p.tokens.filter(t => t.status === 'open').length;
      const inProgress = p.tokens.filter(t => t.status === 'in_progress').length;
      const done = p.tokens.filter(t => t.status === 'done').length;
      activeTokens += open + inProgress;
      completedTokens += done;

      return {
        id: p.id,
        name: p.name,
        status: p.status,
        memberCount: p._count.members,
        tokenCounts: { open, in_progress: inProgress, done },
        budget: null,
      };
    });

    return NextResponse.json({
      totalProjects,
      totalMembers,
      activeTokens,
      completedTokens,
      projects: projectList,
    });
  } catch {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
