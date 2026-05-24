import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

const RESOURCES = ['users', 'projects', 'tokens', 'tags'];

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    const tag = await prisma.tag.findUnique({ where: { id } });
    if (!tag) {
      return NextResponse.json({ error: 'Tag not found' }, { status: 404 });
    }

    const permissions = await prisma.permission.findMany({
      where: { tagId: id },
    });

    const filled = RESOURCES.map(resource => {
      const existing = permissions.find(p => p.resource === resource);
      return existing || { id: '', tagId: id, resource, canView: false, canCreate: false, canEdit: false, canDelete: false, canAssign: false };
    });

    return NextResponse.json(filled);
  } catch {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const { resource, canView, canCreate, canEdit, canDelete, canAssign } = body;

    const tag = await prisma.tag.findUnique({ where: { id } });
    if (!tag) {
      return NextResponse.json({ error: 'Tag not found' }, { status: 404 });
    }

    const permission = await prisma.permission.upsert({
      where: { tagId_resource: { tagId: id, resource } },
      update: { canView, canCreate, canEdit, canDelete, canAssign },
      create: { tagId: id, resource, canView, canCreate, canEdit, canDelete, canAssign },
    });

    return NextResponse.json(permission);
  } catch {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
