import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getAuthToken, verifyToken } from '@/lib/auth';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const mine = searchParams.get('mine');

    const where: any = {};
    if (mine === 'true') {
      const token = await getAuthToken();
      const payload = token ? verifyToken(token) : null;
      if (!payload) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
      where.members = { some: { userId: payload.userId } };
    }

    const projects = await prisma.project.findMany({
      where,
      include: {
        creator: { select: { id: true, name: true } },
        _count: { select: { members: true } },
        tokens: { select: { status: true } },
      },
      orderBy: { createdAt: 'desc' },
    });

    const result = projects.map(p => {
      const tokenCounts = p.tokens.reduce((acc: Record<string, number>, t) => {
        acc[t.status] = (acc[t.status] || 0) + 1;
        return acc;
      }, {} as Record<string, number>);
      const { tokens, ...rest } = p;
      return { ...rest, tokenCounts };
    });

    return NextResponse.json(result);
  } catch {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const token = await getAuthToken();
    const payload = token ? verifyToken(token) : null;
    if (!payload) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const { name, description, status } = await request.json();

    if (!name) {
      return NextResponse.json({ error: 'Name is required' }, { status: 400 });
    }

    const project = await prisma.project.create({
      data: {
        name,
        description: description || null,
        status: status || undefined,
        createdBy: payload.userId,
      },
    });

    return NextResponse.json(project, { status: 201 });
  } catch {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
