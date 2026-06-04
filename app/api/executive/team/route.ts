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

    const users = await prisma.user.findMany({
      where: { isActive: true },
      select: {
        id: true,
        name: true,
        email: true,
        avatarUrl: true,
        role: true,
        tags: {
          select: {
            tag: {
              select: { name: true, color: true },
            },
          },
        },
      },
      orderBy: { name: 'asc' },
    });

    const result = await Promise.all(
      users.map(async (user) => {
        const assignedTokens = await prisma.token.count({
          where: {
            assignedTo: user.id,
            status: { in: ['open', 'in_progress'] },
          },
        });

        const completedTokens = await prisma.token.count({
          where: {
            assignedTo: user.id,
            status: 'done',
          },
        });

        return {
          id: user.id,
          name: user.name,
          email: user.email,
          avatarUrl: user.avatarUrl,
          role: user.role,
          tags: user.tags.map(t => t.tag),
          assignedTokens,
          completedTokens,
        };
      }),
    );

    return NextResponse.json(result);
  } catch {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
