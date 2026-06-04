import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getAuthToken, verifyToken } from '@/lib/auth';

export async function PATCH(request: NextRequest) {
  try {
    const token = await getAuthToken();
    const payload = token ? verifyToken(token) : null;
    if (!payload) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const body = await request.json();
    const data: Record<string, string> = {};

    if (body.name !== undefined) data.name = body.name;
    if (body.email !== undefined) data.email = body.email;
    if (body.phone !== undefined) data.phone = body.phone;

    if (Object.keys(data).length === 0) {
      return NextResponse.json({ error: 'No fields to update' }, { status: 400 });
    }

    const user = await prisma.user.update({
      where: { id: payload.userId },
      data,
      select: { id: true, name: true, email: true, phone: true, role: true, isActive: true, createdAt: true, updatedAt: true },
    });

    return NextResponse.json(user);
  } catch {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
