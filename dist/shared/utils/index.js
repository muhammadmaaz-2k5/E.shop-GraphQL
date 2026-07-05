import { randomUUID } from 'crypto';
export function generateId() {
    return randomUUID();
}
export function capitalize(str) {
    return str.charAt(0).toUpperCase() + str.slice(1);
}
export function slugify(str) {
    return str
        .toLowerCase()
        .trim()
        .replace(/[^\w\s-]/g, '')
        .replace(/[\s_-]+/g, '-')
        .replace(/^-+|-+$/g, '');
}
export function toCursor(data) {
    return Buffer.from(data).toString('base64');
}
export function fromCursor(cursor) {
    try {
        return Buffer.from(cursor, 'base64').toString('utf-8');
    }
    catch {
        return '0';
    }
}
export function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}
export function omit(obj, keys) {
    const result = { ...obj };
    for (const key of keys) {
        delete result[key];
    }
    return result;
}
export function pick(obj, keys) {
    const result = {};
    for (const key of keys) {
        if (key in obj) {
            result[key] = obj[key];
        }
    }
    return result;
}
//# sourceMappingURL=index.js.map