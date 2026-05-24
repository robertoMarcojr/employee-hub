import { prisma } from '@/lib/prisma';
import PermissionsEditor from '@/components/PermissionsEditor';
import { notFound } from 'next/navigation';

const RESOURCES = ['users', 'projects', 'tokens', 'tags'];

export default async function TagPermissionsPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const tag = await prisma.tag.findUnique({ where: { id } });
  if (!tag) notFound();

  const permissions = await prisma.permission.findMany({ where: { tagId: id } });

  const filled = RESOURCES.map(resource => {
    const existing = permissions.find(p => p.resource === resource);
    return existing
      ? { id: existing.id, tagId: existing.tagId, resource: existing.resource, canView: existing.canView, canCreate: existing.canCreate, canEdit: existing.canEdit, canDelete: existing.canDelete, canAssign: existing.canAssign }
      : { id: '', tagId: id, resource, canView: false, canCreate: false, canEdit: false, canDelete: false, canAssign: false };
  });

  return (
    <PermissionsEditor
      tag={{ id: tag.id, name: tag.name, color: tag.color }}
      initialPermissions={filled}
    />
  );
}
