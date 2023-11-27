import { isArray, isObject } from "./types";

type Indexable = Record<string, any> | any[];
type Index = string | number;

function isValidIndexableCombination(indexable: Indexable, index: Index): boolean {
    return (isArray(indexable) && typeof(index) === "number") || 
        (isObject(indexable) && typeof(index) === "string");
}

export function setPath(indexable: Indexable, path: Index[], value: any) {
    const finalContainerPath = [...path];

    const finalPathElement = finalContainerPath.pop();
    if (finalPathElement === undefined) throw new Error("Provided path is empty");

    const finalContainer = resolvePath(indexable, finalContainerPath);
    if(isValidIndexableCombination(finalContainer, finalPathElement)) {
        finalContainer[finalPathElement] = value;
    } else {
        throw Error("Invalid path provided for object");
    }
}

export function resolvePath(indexable: Indexable, path: Index[]): any {
    let currentValue = indexable
    for (const pathElement of path) {
        if(isValidIndexableCombination(currentValue, pathElement)) {
            currentValue = (currentValue as any)[pathElement];
        } else {
            throw Error("Invalid path provided for object");
        }
    }
    return currentValue;
}

export function recurse(indexable: Indexable, handler: (key: Index, value: any, fullPath: Index[]) => void, currentPath: Index[] = []) {
    const itemHandler = (index: Index, value: any) => {
        const newPath = [...currentPath, index];
        if(isObject(value)) {
            recurse(value, handler,  newPath);
        } else if(isArray(value)) {
            recurse(value, handler, newPath);
        } else {
            handler(index, value, newPath);
        }
    }
    if(isArray(indexable)) {
        indexable.forEach((value, index) => itemHandler(index, value));
    } else if(isObject(indexable)) {
        Object.entries(indexable).forEach(([key, value]) => itemHandler(key, value));
    }
}
