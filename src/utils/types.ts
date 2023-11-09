export function isObject<T>(item: T) {
    return item !== null && 
        typeof item === 'object' && 
        !Array.isArray(item);
}

export function isArray<T>(item: T) {
    return item !== null && 
        typeof item === 'object' && 
        Array.isArray(item);
}
