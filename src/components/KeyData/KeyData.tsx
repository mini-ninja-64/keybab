import { useMemo } from "react";
import { KeyElement } from "../Key/Key";
import { deepCopy } from "deep-copy-ts";
import { recurse, resolvePath, setPath } from "../../utils/objects";
import { LabelInput } from "./LabelInput";

export function KeyData(props: {selectedKeys: Set<number>, keyElements: KeyElement[], setKeyElements: (keys: KeyElement[]) => void}) {
    const commonKeyData = useMemo<RecursivePartial<KeyElement> | undefined>(() => {
        if (props.selectedKeys.size === 0) return undefined;

        const selectedKeys = [...props.selectedKeys]
            .map((keyIndex) => props.keyElements[keyIndex]);

        const commonKey: RecursivePartial<KeyElement> = deepCopy(selectedKeys[0]);
        selectedKeys
            .forEach((keyElement) => {
                recurse(keyElement, (_key, value, path) => {
                    if(value !== resolvePath(commonKey, path)) setPath(commonKey, path, undefined);
                })
            });
        return commonKey;
    }, [props.selectedKeys, props.keyElements])

    const updateSelectedKeys = (callback: (key: KeyElement) => void) => {
        const keys = [...props.keyElements];
        keys.forEach((key, index) => {
            if(props.selectedKeys.has(index)) callback(key);
        })
        props.setKeyElements(keys);
    }
    const keyText = commonKeyData?.content?.text || [[],[],[],[]];
    
    return <form>
        <h3>Selected Keys: {[...props.selectedKeys].join(", ")}</h3>
        {commonKeyData?.content?.text?.map((line, index) => 
            <h4>content {index}: {line.join(", ")}</h4>)
        }
        <div style={{display: "grid", gridTemplate: `repeat(4, 1fr) / repeat(3, 1fr)`}}>
            {commonKeyData?.content?.text?.flatMap((line, row) => 
                line?.map((value, column) => 
                    <input 
                        style={{gridRow: row+1, gridColumn: column+1}} 
                        value={value} 
                        onChange={v => updateSelectedKeys((key) => key.content.text[row][column] = v.target.value)}
                    />
                ))
            }
        </div> 
        <LabelInput label="x:" value={commonKeyData?.position?.x} onChange={(newX) => updateSelectedKeys((key) => key.position.x = Number.parseFloat(newX))} />
        <LabelInput label="y:" value={commonKeyData?.position?.y} onChange={(newY) => updateSelectedKeys((key) => key.position.y = Number.parseFloat(newY))} />

        <LabelInput label="width:" value={commonKeyData?.dimension?.width} onChange={(newWidth) => updateSelectedKeys((key) => key.dimension.width = Number.parseFloat(newWidth))} />
        <LabelInput label="height:" value={commonKeyData?.dimension?.height} onChange={(newHeight) => updateSelectedKeys((key) => key.dimension.height = Number.parseFloat(newHeight))} />

        <LabelInput label="rectangle 2 width:" value={commonKeyData?.dimension2?.width} onChange={(newWidth) => updateSelectedKeys((key) => key.dimension2.width = Number.parseFloat(newWidth))} />
        <LabelInput label="rectangle 2 height:" value={commonKeyData?.dimension2?.height} onChange={(newHeight) => updateSelectedKeys((key) => key.dimension2.height = Number.parseFloat(newHeight))} />

        <LabelInput label="rectangle 2 offset x:" value={commonKeyData?.dimension2Offset?.x} onChange={(newX) => updateSelectedKeys((key) => key.dimension2Offset.x = Number.parseFloat(newX))} />
        <LabelInput label="rectangle 2 offset y:" value={commonKeyData?.dimension2Offset?.y} onChange={(newY) => updateSelectedKeys((key) => key.dimension2Offset.y = Number.parseFloat(newY))} />

        <h4>Width2: {commonKeyData?.dimension2?.width}</h4>
        <h4>Height2: {commonKeyData?.dimension2?.height}</h4>
    </form>
}
