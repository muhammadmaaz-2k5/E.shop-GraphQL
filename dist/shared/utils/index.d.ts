export declare function generateId(): string;
export declare function capitalize(str: string): string;
export declare function slugify(str: string): string;
export declare function toCursor(data: string): string;
export declare function fromCursor(cursor: string): string;
export declare function sleep(ms: number): Promise<void>;
export declare function omit<T extends object, K extends keyof T>(obj: T, keys: K[]): Omit<T, K>;
export declare function pick<T extends object, K extends keyof T>(obj: T, keys: K[]): Pick<T, K>;
//# sourceMappingURL=index.d.ts.map