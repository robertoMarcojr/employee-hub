import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getAuthToken, verifyToken } from '@/lib/auth';

export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;

    const token = await prisma.token.findUnique({
      where: { id },
      include: {
        project: true,
        raiser: { select: { name: true, avatarUrl: true } },
        assignee: { select: { name: true, avatarUrl: true } },
        tokenLinks: true,
      },
    });

    if (!token) {
      return NextResponse.json({ error: 'Token not found' }, { status: 404 });
    }

    return NextResponse.json(token);
  } catch {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function PUT(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const token = await getAuthToken();
    const payload = token ? verifyToken(token) : null;
    if (!payload) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const { id } = await params;
    const { title, description, status, priority, assignedTo } = await request.json();

    const existing = await prisma.token.findUnique({ where: { id } });
    if (!existing) {
      return NextResponse.json({ error: 'Token not found' }, { status: 404 });
    }

    const data: any = {};
    if (title !== undefined) data.title = title;
    if (description !== undefined) data.description = description;
    if (priority !== undefined) data.priority = priority;

    if (status !== undefined) {
      data.status = status;

      if (status === 'in_progress') {
        if (!existing.assignedTo && !assignedTo) {
          data.assignedTo = payload.userId;
        }
        if (!existing.startedAt) {
          data.startedAt = new Date();
        }
      }

      if (status === 'done') {
        if (!existing.completedAt) {
          data.completedAt = new Date();
        }
      }

      if (status === 'open' && existing.status === 'in_progress') {
        data.assignedTo = null;
        data.startedAt = null;
      }
    }

    if (assignedTo !== undefined) {
      data.assignedTo = assignedTo;
    }

    const updated = await prisma.token.update({
      where: { id },
      data,
    });

    return NextResponse.json(updated);
  } catch {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const token = await getAuthToken();
    const payload = token ? verifyToken(token) : null;
    if (!payload) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const { id } = await params;

    await prisma.token.delete({ where: { id } });

    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
