import React, {ReactInstance, RefObject} from "react";
import {Button} from "semantic-ui-react";

type Properties = {
    bannerRef: any
}

type States = {}

export default class BannerDownload extends React.Component<Properties, States> {
    download = async () => {
        const { exportComponentAsPNG } = await import('react-component-export-image')
        await exportComponentAsPNG(this.props.bannerRef, {fileName: 'banner-rundown.png'})
    }
    render() {
        return (
            <>
                <Button onClick={this.download}>Download as PNG</Button>
            </>
        );
    }
}