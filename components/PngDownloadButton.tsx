import React, {MutableRefObject} from "react";
import {Button} from "semantic-ui-react";

type Properties = {
    node: MutableRefObject<any>
    name: string
}

export default function PngDownloadButton(
    {
        node,
        name,
    }: Properties
) {
    async function download() {
        // note: this lib uses react finddom - this will be deprecated in the future...
        const {exportComponentAsPNG} = await import('react-component-export-image')

        // seems similar to https://github.com/niklasvh/html2canvas/issues/1438
        await exportComponentAsPNG(node, {
            fileName: name + '.png',
            // html2CanvasOptions: {
            //     width: Math.max(
            //         node.current.scrollWidth ?? 0,
            //         node.current.offsetWidth ?? 0,
            //         node.current.clientWidth ?? 0,
            //     ) + 16,
            //     x: -8
            // },
        })
    }

    return (
        <>
            <Button onClick={download}>Download as PNG</Button>
        </>
    )
}