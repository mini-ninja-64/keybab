import { useEffect, useMemo, useState } from 'react'
import './App.css'
import { Dimension, KeyElement } from './components/Key/Key'
import { KeyDisplay } from './components/KeyDisplay/KeyDisplay'
import { parse } from './utils/kle'
import { KeyData } from './components/KeyData/KeyData'

type KeyModifierFunction = (key: KeyElement) =>void;
type KeyBehaviourLookup = Record<string, KeyModifierFunction>;

type Modifier = "none" | "shift";

const movementIncrement = 0.25;

function dimensionsEqual(dimension1: Dimension, dimension2: Dimension) {
    return (dimension1.width === dimension2.width) && 
        (dimension1.height === dimension2.height)
}

const keyBehaviourMods: Record<Modifier, KeyBehaviourLookup> = {
    "none": {
        "ArrowUp": (key: KeyElement) => key.position.y-=movementIncrement,
        "ArrowDown": (key: KeyElement) => key.position.y+=movementIncrement,
        "ArrowLeft": (key: KeyElement) => key.position.x-=movementIncrement,
        "ArrowRight": (key: KeyElement) => key.position.x+=movementIncrement
    },
    "shift": {
        "ArrowUp": (key: KeyElement) => key.dimension.height-=movementIncrement,
        "ArrowDown": (key: KeyElement) => key.dimension.height+=movementIncrement,
        "ArrowLeft": (key: KeyElement) => key.dimension.width-=movementIncrement,
        "ArrowRight": (key: KeyElement) =>  key.dimension.width+=movementIncrement
    },
}

const iso60Kle = [["¬\n`","!\n1","\"\n2","£\n3","$\n4","%\n5","^\n6","&\n7","*\n8","(\n9",")\n0","_\n-","+\n=",{"w":2},"Backspace"],[{"w":1.5},"Tab","Q","W","E","R","T","Y","U","I","O","P","{\n[","}\n]",{"x":0.25,"w":1.25,"h":2,"w2":1.5,"h2":1,"x2":-0.25},"Enter"],[{"w":1.75},"Caps Lock","A","S","D","F","G","H","J","K","L",":\n;","@\n'","~\n#"],[{"w":1.25},"Shift","|\n\\","Z","X","C","V","B","N","M","<\n,",">\n.","?\n/",{"w":2.75},"Shift"],[{"w":1.25},"Ctrl",{"w":1.25},"Win",{"w":1.25},"Alt",{"a":7,"w":6.25},"",{"a":4,"w":1.25},"AltGr",{"w":1.25},"Win",{"w":1.25},"Menu",{"w":1.25},"Ctrl"]]
const iso60 = JSON.stringify(iso60Kle);

function App() {
  const [kle, setKle] = useState(iso60);
  const [keys, setKeys] = useState<KeyElement[]>(parse(iso60Kle));
  const [selection, setSelection] = useState<Set<number>>(new Set());

  const jsonKeys = useMemo(() => JSON.stringify(keys),[keys]);


  useEffect(() => {
    const handleKeyPress = (event: KeyboardEvent) => {
        const clonedKeys = [...keys];
        let keyModifier: KeyModifierFunction | undefined;
        if(event.shiftKey) keyModifier = keyBehaviourMods["shift"][event.code];
        else keyModifier = keyBehaviourMods["none"][event.code];

        if(keyModifier === undefined) return;
        const keyModFunction = keyModifier;

        selection
            .forEach((keyIndex) => {
                const keyElement = clonedKeys[keyIndex];
                const previousDimension = {...keyElement.dimension};
                keyModFunction(keyElement);
                if(keyElement.position.x < 0) keyElement.position.x = 0;
                if(keyElement.position.y < 0) keyElement.position.y = 0;

                if(keyElement.dimension.width < 1) keyElement.dimension.width = 1;
                if(keyElement.dimension.height < 1) keyElement.dimension.height = 1;

                if (!dimensionsEqual(previousDimension, keyElement.dimension)) {
                    keyElement.dimension2 = {...keyElement.dimension};
                    keyElement.dimension2Offset = {x: 0, y: 0};
                }
            });
        
        event.preventDefault();
        setKeys(clonedKeys);
    }
    document.addEventListener("keydown", handleKeyPress);
    return () => {
        document.removeEventListener("keydown", handleKeyPress);
    };
},[keys, selection]);

  return <>
    <div>hi</div>
    <h2>KLE:</h2>
    <textarea onChange={(event) => {
      setKle(event.target.value);
      setKeys(parse(JSON.parse(event.target.value)));
    }} value={kle}/>
    <h2>Normalized keys:</h2>
    <textarea value={jsonKeys}/>
    <KeyDisplay keyElements={keys} selectedKeys={selection} setSelectedKeys={setSelection}/>
    <KeyData selectedKeys={selection} keyElements={keys} setKeyElements={setKeys}/>
    <div> hi smelly2</div>
  </>
}

export default App
