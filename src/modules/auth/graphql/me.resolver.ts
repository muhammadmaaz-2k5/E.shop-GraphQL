export function mapDbUser(data: Record<string, unknown>, avatar?: string | null, phone?: string | null): User {
  return {
    id: data.id as string,
    email: data.email as string,
    role: data.role as User['role'],
    permissions: (data.permissions as string[]) ?? [],
    firstName: data.first_name as string | undefined,
    lastName: data.last_name as string | undefined,
    avatarUrl: avatar ?? undefined,
    phone: phone ?? undefined,
    isActive: data.is_active as boolean,
    emailVerified: data.email_verified as boolean,
    createdAt: new Date(data.created_at as string),
    updatedAt: new Date(data.updated_at as string),
  };
}

import type { User } from '../auth.types.js';

export { User };
