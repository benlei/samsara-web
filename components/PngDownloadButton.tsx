import React, {MutableRefObject} from "react";
import {Button} from "semantic-ui-react";
import ReactGA from "react-ga4";

type Properties = {
    node: MutableRefObject<any>
    name: string
    type: string
}

export default function PngDownloadButton(
    {
        node,
        name,
        type,
    }: Properties
) {
    async function download() {
        // note: this lib uses react finddom - this will be deprecated in the future...
        const {exportComponentAsPNG} = await import('react-component-export-image')

        // Send a custom event
        ReactGA.event({
            category: `${name}.${type}`,
            action: 'download_png',
            label: `Download PNG used for ${name} ${type}.`,
        });

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