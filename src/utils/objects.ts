import { isObject } from "./types";

export function resolvePath(object: Record<string, any>, path: string[]) {
    let currentValue = object
    for (const pathElement of path) {
        currentValue = currentValue[pathElement];
        if(currentValue === undefined) break;
    }
    return currentValue;
}

export function setPath(object: Record<string, any>, path: string[], value: any) {
    let currentValue = object;
    const pathCopy = [...path];

    const finalPathElement = pathCopy.pop();
    if (finalPathElement === undefined) throw new Error("Provided path is empty");

    for (const pathElement of pathCopy) {
        if(currentValue[pathElement] === undefined) {
            currentValue[pathElement] = {};
        } else if(isObject(currentValue[pathElement])) {
        } else {
            throw new Error("Unexpected object layout");
        }

        currentValue = currentValue[pathElement];
    }
    currentValue[finalPathElement] = value
}


export function recurseObject<T extends {[k: string]: any}>(object: T, handler: (key: string, value: any, fullPath: string[]) => void, currentPath: string[] = []) {
    Object.entries(object).forEach(([key, value]) => {
        const newPath =  [...currentPath, key]
        if(isObject(value)) {
            recurseObject(value, handler,  newPath);
        } else {
            handler(key, value, newPath);
        }
    })
}