import { NextResponse } from 'next/server';
import { getCurrentUser, unauthorized } from '@/lib/api-helpers';
import { getEffectivePermissions } from '@/lib/permissions';

export async function GET() {
  const user = await getCurrentUser();
  if (!user) return unauthorized();

  const permissions = await getEffectivePermissions(user.id);
  return NextResponse.json({ permissions, user });
}
