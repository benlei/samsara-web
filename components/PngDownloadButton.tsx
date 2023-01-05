import React from "react";
import {Button} from "semantic-ui-react";

type Properties = {
    componentRef: any
    name: string
}

export default function PngDownloadButton(
    {
        componentRef,
        name,
    }: Properties
) {
    async function download() {
        const {exportComponentAsPNG} = await import('react-component-export-image')
        console.log('got past here')
        console.log(componentRef)
        await exportComponentAsPNG(componentRef, {fileName: name + '.png'})
    }

    return (
        <>
            <Button onClick={download}>Download as PNG</Button>
        </>
    )
}