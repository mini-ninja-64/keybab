export function isObject(item: any): item is Record<string, any> {
    return item !== null && 
        typeof item === 'object' && 
        !Array.isArray(item);
}

export function isArray(item: any): item is any[] {
    return item !== null && 
        typeof item === 'object' && 
        Array.isArray(item);
}
