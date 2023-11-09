import { KeyElement, Position } from "../components/Key/Key";

interface KeyboardLayoutEditorConfigBlock {
    w?: number;
    h?: number;
    x?: number;
    y?: number;

    r?: number;
    rx?: number;
    ry?: number;

    w2?: number;
    h2?: number;
    x1?: number;
    x2?: number;
}
export type KeyboardLayoutEditorDocument = (string | KeyboardLayoutEditorConfigBlock)[][];

const RESET_CONFIG = {
    w: 1,
    h: 1,
    x: 0,
    y: 0,
    r: 0,
    rx: 0,
    ry: 0,
    w2: 1,
    h2: 1,
    x2: 0,
    y2: 0
}

export function parse(kle: KeyboardLayoutEditorDocument): KeyElement[] {
    const keys: KeyElement[] = []
    const cursor: Position = {x: 0, y: 0};
    let currentConfig = {...RESET_CONFIG}
    let keysIndex = 0;
    for (const row of kle) {
        for (const col of row) {
            if (typeof col == "string") {
                const point = {
                    x: cursor.x,
                    y: cursor.y
                };

                keys[keysIndex] = {
                    position: point,
                    rotation: {degrees: currentConfig.r, origin: {x: currentConfig.rx, y: currentConfig.ry}},
                    dimension: {width: currentConfig.w, height: currentConfig.h},
                    dimension2Offset: {x: currentConfig.x2, y: currentConfig.y2},
                    dimension2: {width: currentConfig.w2, height: currentConfig.h2},
                }
                cursor.x += currentConfig.w;
                currentConfig = {...currentConfig, w: 1, h: 1, x: 0, y: 0, x2: 0, y2: 0, w2: 1, h2: 1};
                keysIndex++;
            } else {
                currentConfig = {...currentConfig, ...col};
                if(col.rx) cursor.x = currentConfig.rx;
                if(col.ry) cursor.y = currentConfig.ry;
                if(col.x) cursor.x += currentConfig.x;
                if(col.y) cursor.y += currentConfig.y;
                if(col.w && !col.w2) currentConfig.w2 = currentConfig.w;
                if(col.h && !col.h2) currentConfig.h2 = currentConfig.h;
            }
        }
        cursor.y++;
        cursor.x = 0;
    }

    return keys;
}

export function convert(keyElements: KeyElement[]): KeyboardLayoutEditorDocument {
    return []
}