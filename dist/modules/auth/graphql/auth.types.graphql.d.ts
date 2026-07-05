export declare class UserType {
    id: string;
    email: string;
    role: string;
    permissions: string[];
    firstName?: string;
    lastName?: string;
    avatarUrl?: string;
    isActive: boolean;
    emailVerified: boolean;
    createdAt: Date;
    updatedAt: Date;
}
export declare class LoginResponseType {
    accessToken: string;
    refreshToken: string;
    expiresIn: number;
    user: UserType;
}
export declare class RefreshTokenResponse {
    accessToken: string;
    refreshToken: string;
    expiresIn: number;
}
export declare class RegisterInputType {
    email: string;
    password: string;
    firstName?: string;
    lastName?: string;
}
export declare class LoginInputType {
    email: string;
    password: string;
}
export declare class UserTypeResolver {
    fullName(user: UserType): string | null;
}
//# sourceMappingURL=auth.types.graphql.d.ts.map