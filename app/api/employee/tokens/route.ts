import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getAuthToken, verifyToken } from '@/lib/auth';

export async function GET(request: NextRequest) {
  try {
    const token = await getAuthToken();
    const payload = token ? verifyToken(token) : null;
    if (!payload) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const tokens = await prisma.token.findMany({
      where: { assignedTo: payload.userId },
      include: {
        project: { select: { name: true } },
        raiser: { select: { id: true, name: true } },
      },
      orderBy: { createdAt: 'desc' },
    });

    return NextResponse.json(tokens);
  } catch {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
