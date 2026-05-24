import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const { tagId } = await request.json();

    if (!tagId) {
      return NextResponse.json({ error: 'tagId is required' }, { status: 400 });
    }

    await prisma.userTag.create({
      data: { userId: id, tagId },
    });

    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
