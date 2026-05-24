import { NextResponse } from 'next/server';
import { verifyToken, getAuthToken } from './auth';
import { prisma } from './prisma';

export async function getCurrentUser() {
  const token = await getAuthToken();
  if (!token) return null;

  const payload = verifyToken(token);
  if (!payload) return null;

  const user = await prisma.user.findUnique({
    where: { id: payload.userId },
    select: {
      id: true,
      name: true,
      email: true,
      phone: true,
      isActive: true,
      tags: {
        select: {
          tag: {
            select: { id: true, name: true },
          },
        },
      },
    },
  });

  return user;
}

export function unauthorized() {
  return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
}
