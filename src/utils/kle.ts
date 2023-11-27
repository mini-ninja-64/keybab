import { KeyContent, KeyElement, Position } from "../components/Key/Key";

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
    x2?: number;
    y2?: number;

    a?: number;
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

                const kleTextArray = col.split("\n").map(s => s ? s : undefined);

                keys[keysIndex] = {
                    position: point,
                    rotation: {degrees: currentConfig.r, origin: {x: currentConfig.rx, y: currentConfig.ry}},
                    dimension: {width: currentConfig.w, height: currentConfig.h},
                    dimension2Offset: {x: currentConfig.x2, y: currentConfig.y2},
                    dimension2: {width: currentConfig.w2, height: currentConfig.h2},
                    content: {
                        text: [
                            [kleTextArray[0], kleTextArray[8], kleTextArray[2]],
                            [kleTextArray[6], kleTextArray[9], kleTextArray[7]],
                            [kleTextArray[1], kleTextArray[10], kleTextArray[3]],
                            [kleTextArray[4], kleTextArray[11], kleTextArray[5]]
                        ]
                    }
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

function generateKeyTextString(keyText: KeyContent["text"]): string {
    const emptyOr = (s: string | undefined) => s ? s : ""; 
    const keyString = `${
        emptyOr(keyText[0][0])
    }\n${
        emptyOr(keyText[2][0])
    }\n${
        emptyOr(keyText[0][2])
    }\n${
        emptyOr(keyText[2][2])
    }\n${
        emptyOr(keyText[3][0])
    }\n${
        emptyOr(keyText[3][2])
    }\n${
        emptyOr(keyText[1][0])
    }\n${
        emptyOr(keyText[1][2])
    }\n${
        emptyOr(keyText[0][1])
    }\n${
        emptyOr(keyText[1][1])
    }\n${
        emptyOr(keyText[2][1])
    }\n${
        emptyOr(keyText[3][1])
    }`
    return keyString.trimEnd();
}

function shuffle(array: any[]) {
    let currentIndex = array.length,  randomIndex;
  
    // While there remain elements to shuffle.
    while (currentIndex > 0) {
  
      // Pick a remaining element.
      randomIndex = Math.floor(Math.random() * currentIndex);
      currentIndex--;
  
      // And swap it with the current element.
      [array[currentIndex], array[randomIndex]] = [
        array[randomIndex], array[currentIndex]];
    }
  
    return array;
  }
  
  
export function convert(keys: KeyElement[]): KeyboardLayoutEditorDocument {
    const sortedKeys = [...keys];
    sortedKeys.sort((a, b) => {
        if(a.position.x === b.position.x && a.position.y === b.position.y) {
            return 0;
        } else if((a.position.y < b.position.y) || (a.position.x < b.position.x) && (a.position.y === b.position.y)) {
            return -1;
        } else {
            return 1;
        }
    });

    const kle: KeyboardLayoutEditorDocument = [];

    let keyBuffer: (string | KeyboardLayoutEditorConfigBlock)[] = [];

    let currentX = 0;
    let currentY = 0;
    let currentRotation = 0;
    // TODO: Rotation origin
    // TODO: Alignment flag
    // TODO: Cleanup code
    for (const key of sortedKeys) {
        const keyMetadata: KeyboardLayoutEditorConfigBlock = {};
        if(key.rotation.degrees !== currentRotation) {
            keyMetadata.r = key.rotation.degrees
            currentRotation = key.rotation.degrees
        };

        if(key.position.y > currentY) {
            kle.push(keyBuffer);
            keyBuffer = [];
            currentY++;
            currentX = 0;
        }
        if(key.position.x > currentX) {
            keyMetadata.x = key.position.x - currentX
        }
        if(key.dimension.width !== RESET_CONFIG.w) keyMetadata.w = key.dimension.width;
        if(key.dimension.height !== RESET_CONFIG.h) keyMetadata.h = key.dimension.height;
        if(key.dimension2.width !== key.dimension.width) keyMetadata.w2 = key.dimension2.width;
        if(key.dimension2.height !== key.dimension.height) keyMetadata.h2 = key.dimension2.height;

        if(key.dimension2Offset.x !== RESET_CONFIG.x2) keyMetadata.x2 = key.dimension2Offset.x;
        if(key.dimension2Offset.y !== RESET_CONFIG.y2) keyMetadata.y2 = key.dimension2Offset.y;

        if(Object.keys(keyMetadata).length > 0) {
            keyBuffer.push(keyMetadata);
        }
        keyBuffer.push(generateKeyTextString(key.content.text));
        currentX+=key.dimension.width;
    }
    if(keyBuffer.length > 0) {
        kle.push(keyBuffer);
    }

    return kle;
}
