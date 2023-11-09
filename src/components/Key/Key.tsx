import { MouseEventHandler } from "react";

export interface Position {
    x: number;
    y: number;
}

export interface Rotation {
    origin: Position;
    degrees: number;
}

export interface Dimension {
    width: number
    height: number
}

export interface KeyElement {
    position: Position;
    rotation: Rotation;
    dimension: Dimension;
    dimension2Offset: Position;
    dimension2: Dimension;
}

function RectangleDiv({position, dimension, scale, colour, rotation, borderWidth}: {position: Position, dimension: Dimension, scale: number, rotation: Rotation, borderWidth: number, colour: string}) {
    const xTransformOrigin = rotation.origin.x * scale;
    const yTransformOrigin = rotation.origin.y * scale;
    return <div style={{
        position: "inherit",
        width: dimension.width * scale,
        height: dimension.height * scale,
        backgroundColor: colour,
        padding: 1,
        backgroundClip: "content-box",
        top: position.y * scale,
        left: position.x * scale,
        transform: `rotate(${rotation.degrees}deg)`,
        transformOrigin: `${xTransformOrigin-(position.x*scale)}px ${yTransformOrigin-(position.y*scale)}px`,
        // borderRadius: "10%/ 10%"
        borderWidth: `${borderWidth}px`,
        borderColor: "black",
        borderStyle: "solid"
    }}></div>
}

const circleDiam = 12;

type KeyOnClickHandler = MouseEventHandler<HTMLDivElement>;
export function Key({keyElement, scale, selected, onClick}: {onClick: KeyOnClickHandler, keyElement: KeyElement, scale: number, selected: boolean}) {
    const xTransformOrigin = keyElement.rotation.origin.x * scale;
    const yTransformOrigin = keyElement.rotation.origin.y * scale;

    const rectangle2Position = {
        x: keyElement.position.x + keyElement.dimension2Offset.x,
        y: keyElement.position.y + keyElement.dimension2Offset.y 
    }

    const borderWidth = selected ? 1 : 0;
    return <>
    <div onClick={onClick} style={{position: "absolute"}} >
        <RectangleDiv borderWidth={borderWidth} colour="teal" rotation={keyElement.rotation} position={rectangle2Position} dimension={keyElement.dimension2} scale={scale}/>
        <RectangleDiv borderWidth={borderWidth} colour="pink" rotation={keyElement.rotation} position={keyElement.position} dimension={keyElement.dimension} scale={scale}/>
    </div>
    </>
}
