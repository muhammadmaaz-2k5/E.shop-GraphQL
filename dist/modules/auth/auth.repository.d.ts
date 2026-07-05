import { Sequelize } from 'sequelize';
import type { User } from './auth.types.js';
export declare class UserRepository {
    constructor(_db: Sequelize);
    findById(id: string): Promise<User | null>;
    findByEmail(email: string): Promise<User | null>;
    update(id: string, input: Partial<{
        firstName: string;
        lastName: string;
        phone: string;
        avatarUrl: string;
    }>): Promise<User>;
    private mapUser;
}
//# sourceMappingURL=auth.repository.d.ts.map