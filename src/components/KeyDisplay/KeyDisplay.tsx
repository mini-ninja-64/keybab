import { useState } from "react";
import { KeyElement, Key } from "../Key/Key";

export function KeyDisplay({selectedKeys, setSelectedKeys, keyElements}: {keyElements: KeyElement[], selectedKeys: Set<number>, setSelectedKeys: (selectedKeys: Set<number>) => void}) {
    const [lastSelected, setLastSelected] = useState<number>(0);

    return <div style={{position: "relative", height: "400px"}}>
        {keyElements.map((key, index) => {
            const selected = selectedKeys.has(index);
            return <Key 
                onClick={(event) => {
                    if (event.ctrlKey) {
                        const selectionCopy = new Set(selectedKeys);
                        if(selected) selectionCopy.delete(index);
                        else selectionCopy.add(index);
                        setSelectedKeys(selectionCopy)
                    } else if(!selected){
                        setSelectedKeys(new Set([index]));
                    } else {
                        setSelectedKeys(new Set());
                    }
                    setLastSelected(index);
                }}
                selected={selected} 
                keyElement={key} 
                scale={64} 
                key={index}/>
        })}
        <div></div>
    </div>
}
