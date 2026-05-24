import { prisma } from './prisma';

export interface EffectivePermissions {
  [resource: string]: {
    canView: boolean;
    canCreate: boolean;
    canEdit: boolean;
    canDelete: boolean;
    canAssign: boolean;
  };
}

export async function getEffectivePermissions(userId: string): Promise<EffectivePermissions> {
  const userTags = await prisma.userTag.findMany({
    where: { userId },
    select: {
      tag: {
        select: {
          permissions: {
            select: {
              resource: true,
              canView: true,
              canCreate: true,
              canEdit: true,
              canDelete: true,
              canAssign: true,
            },
          },
        },
      },
    },
  });

  const effective: EffectivePermissions = {};

  for (const ut of userTags) {
    for (const perm of ut.tag.permissions) {
      if (!effective[perm.resource]) {
        effective[perm.resource] = {
          canView: false,
          canCreate: false,
          canEdit: false,
          canDelete: false,
          canAssign: false,
        };
      }
      effective[perm.resource].canView ||= perm.canView;
      effective[perm.resource].canCreate ||= perm.canCreate;
      effective[perm.resource].canEdit ||= perm.canEdit;
      effective[perm.resource].canDelete ||= perm.canDelete;
      effective[perm.resource].canAssign ||= perm.canAssign;
    }
  }

  return effective;
}
