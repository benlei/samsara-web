import React from "react";
import {Container} from "semantic-ui-react";
import BannerOptionsComponent from "@/components/banners/BannerOptions";
import BannerTableComponent from "@/components/banners/BannerTable";
import getVersionParts from "@/banners/version";
import {getRundowns} from "@/banners/rundown";
import BannerDownloadComponent from "@/components/banners/BannerDownload";
import {BannerResource} from "@/banners/types";

type Properties = {
    banners: BannerResource
    bannerType: string

    standards?: string[]
    showLimitedOnly: boolean
}

type States = {
    limitedOnly: boolean | null
    sortBy: string | null
    order: string | null
}

export default class BannerPageComponent extends React.Component<Properties, States> {
    private componentRef: React.RefObject<any>

    constructor(props: Readonly<Properties> | Properties) {
        super(props);

        this.state = {
            limitedOnly: null,
            sortBy: null,
            order: null,
        }

        this.componentRef = React.createRef()
    }

    render() {
        const {
            banners,
            bannerType,
            standards,
            showLimitedOnly,
        } = this.props

        const {
            limitedOnly,
            sortBy,
            order,
        } = this.state


        const setLimitedOnly = (v: boolean) => this.setState({limitedOnly: v})
        const setSortBy = (v: string) => this.setState({sortBy: v})
        const setOrder = (v: string) => this.setState({order: v})

        return (
            <>
                <Container style={{marginTop: '2em'}}>
                    <BannerOptionsComponent showLimitedOnly={showLimitedOnly} limitedOnly={limitedOnly}
                                            setLimitedOnly={setLimitedOnly}
                                            order={order} setOrder={setOrder}
                                            sortBy={sortBy} setSortBy={setSortBy}
                    />
                </Container>
                <Container style={{overflowX: 'scroll'}}>
                    <BannerTableComponent bannerType={bannerType}
                                          versionParts={getVersionParts(banners)}
                                          rundown={getRundowns(banners)}
                                          limitedOnly={limitedOnly}
                                          order={order}
                                          sortBy={sortBy}
                                          standards={standards}
                                          ref={this.componentRef}

                    />
                </Container>
                <Container style={{marginTop: '2em'}}>
                    <BannerDownloadComponent bannerRef={this.componentRef}/>
                </Container>
            </>
        )
    }
}
