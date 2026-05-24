import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function DELETE(request: NextRequest, { params }: { params: Promise<{ id: string; tagId: string }> }) {
  try {
    const { id, tagId } = await params;

    await prisma.userTag.delete({
      where: {
        userId_tagId: { userId: id, tagId },
      },
    });

    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
