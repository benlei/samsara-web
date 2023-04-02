import React, {MutableRefObject} from "react";
import {Button} from "semantic-ui-react";

type Properties = {
    node: MutableRefObject<any>
    name: string
    scrollXOffset?: number
    scrollYOffset?: number
    windowWidthOffset?: number
    windowHeightOffset?: number
    widthOffset?: number
}

export default function PngDownloadButton(
    {
        node,
        name,
        scrollXOffset = 0,
        scrollYOffset = 0,
        windowWidthOffset = 0,
        windowHeightOffset = 0,
        widthOffset = 0,
    }: Properties
) {
    async function download() {
        // note: this lib uses react finddom - this will be deprecated in the future...
        const {exportComponentAsPNG} = await import('react-component-export-image')

        await exportComponentAsPNG(node, {
            fileName: name + '.png',
            html2CanvasOptions: {
                backgroundColor: 'transparent',
            },
        })
    }

    return (
        <>
            <Button onClick={download}>Download as PNG</Button>
        </>
    )
}