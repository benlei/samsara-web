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

        // seems similar to https://github.com/niklasvh/html2canvas/issues/1438
        await exportComponentAsPNG(node, {
            fileName: name + '.png',
            html2CanvasOptions: {
                scrollX: -window.scrollX + scrollXOffset,
                scrollY: -window.scrollY + scrollYOffset,
                windowWidth: document.documentElement.offsetWidth + windowWidthOffset,
                windowHeight: document.documentElement.offsetHeight + windowHeightOffset,
                width: Math.max(
                    node.current.scrollWidth ?? 0,
                    node.current.offsetWidth ?? 0,
                    node.current.clientWidth ?? 0,
                ) + widthOffset,
            },
        })
    }

    return (
        <>
            <Button onClick={download}>Download as PNG</Button>
        </>
    )
}