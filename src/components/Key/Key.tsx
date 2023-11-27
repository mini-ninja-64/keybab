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
    content: KeyContent;
}

export interface KeyContent {
    text: [
        [string?, string?, string?],
        [string?, string?, string?],
        [string?, string?, string?],
        [string?, string?, string?]
    ]
}

function RectangleDiv({position, dimension, colour, rotation, borderWidth, text}: {position: Position, dimension: Dimension, rotation: Rotation, borderWidth: number, colour: string, text: KeyContent["text"]}) {
    return <div style={{
        position: "inherit",
        width: dimension.width,
        height: dimension.height,
        backgroundColor: colour,
        padding: 1,
        backgroundClip: "content-box",
        top: position.y,
        left: position.x,
        transform: `rotate(${rotation.degrees}deg)`,
        transformOrigin: `${rotation.origin.x-position.x}px ${rotation.origin.y-position.y}px`,
        // borderRadius: "10%/ 10%"
        borderWidth: `${borderWidth}px`,
        borderColor: "black",
        borderStyle: "solid",
        display: "grid",
        gridTemplate: "repeat(3, 1fr) / repeat(3, 1fr)",
    }}>
        <div style={{gridRow: "1", gridColumn: "1", minWidth: "0", minHeight: "0" }}>{text[0][0]}</div>
        <div style={{gridRow: "2", gridColumn: "1", minWidth: "0", minHeight: "0" }}>{text[1][0]}</div>
        <div style={{gridRow: "3", gridColumn: "1", minWidth: "0", minHeight: "0" }}>{text[2][0]}</div>

        <div style={{gridRow: "1", gridColumn: "2", minWidth: "0", minHeight: "0" }}>{text[0][1]}</div>
        <div style={{gridRow: "2", gridColumn: "2", minWidth: "0", minHeight: "0" }}>{text[1][1]}</div>
        <div style={{gridRow: "3", gridColumn: "2", minWidth: "0", minHeight: "0" }}>{text[2][1]}</div>

        <div style={{gridRow: "1", gridColumn: "3", minWidth: "0", minHeight: "0" }}>{text[0][2]}</div>
        <div style={{gridRow: "2", gridColumn: "3", minWidth: "0", minHeight: "0" }}>{text[1][2]}</div>
        <div style={{gridRow: "3", gridColumn: "3", minWidth: "0", minHeight: "0" }}>{text[2][2]}</div>
    </div>
}

RectangleDiv.defaultProps = {
    text: [[],[],[]]
}

const circleDiam = 12;

type KeyOnClickHandler = MouseEventHandler<HTMLDivElement>;
export function Key({keyElement, scale, selected, onClick}: {onClick: KeyOnClickHandler, keyElement: KeyElement, scale: number, selected: boolean}) {
    const scaledPosition2: Position = {
        x: (keyElement.position.x + keyElement.dimension2Offset.x) * scale,
        y: (keyElement.position.y + keyElement.dimension2Offset.y) * scale 
    }

    const scaledDimension2: Dimension = {
        width: keyElement.dimension2.width * scale,
        height: keyElement.dimension2.height * scale
    }

    const scaledPosition: Position = {
        x: keyElement.position.x * scale,
        y: keyElement.position.y * scale
    }

    const scaledDimension: Dimension = {
        width: keyElement.dimension.width * scale,
        height: keyElement.dimension.height * scale
    }

    const scaledRotation: Rotation = {
        origin: {
            x: keyElement.rotation.origin.x * scale,
            y: keyElement.rotation.origin.y * scale
        },
        degrees: keyElement.rotation.degrees
    };

    const borderWidth = selected ? 1 : 0;
    return <>
    <div onClick={onClick} style={{
        position: "absolute",
    }} >
        <RectangleDiv borderWidth={borderWidth} colour="teal" rotation={scaledRotation} position={scaledPosition2} dimension={scaledDimension2}/>
        <RectangleDiv borderWidth={borderWidth} colour="pink" rotation={scaledRotation} position={scaledPosition} dimension={scaledDimension} text={keyElement.content.text}/>
    </div>
    </>
}
