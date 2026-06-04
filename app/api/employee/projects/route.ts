import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getAuthToken, verifyToken } from '@/lib/auth';

export async function GET(request: NextRequest) {
  try {
    const token = await getAuthToken();
    const payload = token ? verifyToken(token) : null;
    if (!payload) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const memberships = await prisma.projectMember.findMany({
      where: { userId: payload.userId },
      include: {
        project: {
          include: {
            _count: { select: { members: true } },
            tokens: { select: { status: true } },
          },
        },
      },
    });

    const result = memberships.map(({ project }) => {
      const tokenCounts = project.tokens.reduce((acc: Record<string, number>, t) => {
        acc[t.status] = (acc[t.status] || 0) + 1;
        return acc;
      }, {} as Record<string, number>);

      return {
        ...project,
        tokenCounts,
      };
    });

    return NextResponse.json(result);
  } catch {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
