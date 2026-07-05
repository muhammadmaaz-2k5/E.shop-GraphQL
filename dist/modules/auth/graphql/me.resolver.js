export function mapDbUser(data, avatar, phone) {
    return {
        id: data.id,
        email: data.email,
        role: data.role,
        permissions: data.permissions ?? [],
        firstName: data.first_name,
        lastName: data.last_name,
        avatarUrl: avatar ?? undefined,
        phone: phone ?? undefined,
        isActive: data.is_active,
        emailVerified: data.email_verified,
        createdAt: new Date(data.created_at),
        updatedAt: new Date(data.updated_at),
    };
}
//# sourceMappingURL=me.resolver.js.map