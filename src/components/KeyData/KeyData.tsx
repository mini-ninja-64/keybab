import { useMemo } from "react";
import { KeyElement } from "../Key/Key";
import { deepCopy } from "deep-copy-ts";
import { recurseObject, resolvePath, setPath } from "../../utils/objects";

export function KeyData(props: {selectedKeys: Set<number>, keyElements: KeyElement[], setKeyElements: (keys: KeyElement[]) => void}) {
    const commonKeyData = useMemo<RecursivePartial<KeyElement> | undefined>(() => {
        if (props.selectedKeys.size === 0) return undefined;

        const selectedKeys = [...props.selectedKeys]
            .map((keyIndex) => props.keyElements[keyIndex]);

        const commonKey: RecursivePartial<KeyElement> = deepCopy(selectedKeys[0]);
        selectedKeys
            .forEach((keyElement) => {
                recurseObject(keyElement, (_key, value, path) => {
                    if(value !== resolvePath(commonKey, path)) setPath(commonKey, path, undefined);
                })
            });
        return commonKey;
    }, [props.selectedKeys, props.keyElements])


    return <form>
        <h3>Selected Keys: {[...props.selectedKeys].join(", ")}</h3>
        <h4>X: {commonKeyData?.position?.x}</h4>
        <h4>Y: {commonKeyData?.position?.y}</h4>

        <h4>Width: {commonKeyData?.dimension?.width}</h4>
        <h4>Height: {commonKeyData?.dimension?.height}</h4>

        <h4>Width2: {commonKeyData?.dimension2?.width}</h4>
        <h4>Height2: {commonKeyData?.dimension2?.height}</h4>
    </form>
}
