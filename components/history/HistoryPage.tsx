import React from "react";
import {Container, Ref} from "semantic-ui-react";
import HistoryOptions from "@/components/history/HistoryOptions";
import BannerTable from "@/components/history/BannerTable";
import getVersionParts from "@/banners/version";
import {getRundowns} from "@/banners/rundown";
import {FeaturedHistory} from "@/banners/types";
import ScrollContainer from "react-indiana-drag-scroll";
import PngDownloadButton from "@/components/PngDownloadButton";
import _ from "lodash";

type Properties = {
    featuredList: FeaturedHistory[]
    bannerType: string
}

type States = {
    sortBy: string
    order: string
}

export default class HistoryPage extends React.Component<Properties, States> {
    private componentRef: React.RefObject<any>

    constructor(props: Readonly<Properties> | Properties) {
        super(props);

        this.state = {
            sortBy: 'last',
            order: 'desc',
        }

        this.componentRef = React.createRef()
    }

    render() {
        const {
            featuredList,
            bannerType,
        } = this.props

        const {
            sortBy,
            order,
        } = this.state


        const setSortBy = (v: string) => this.setState({sortBy: v})
        const setOrder = (v: string) => this.setState({order: v})

        return (
            <>
                <Container style={{marginTop: '1em'}}>
                    <HistoryOptions
                                    order={order} setOrder={setOrder}
                                    sortBy={sortBy} setSortBy={setSortBy}
                    />
                </Container>
                <Container style={{marginTop: '1em'}}>
                    <ScrollContainer className="scroll-container" hideScrollbars={false} ignoreElements={'input'}>
                        <Ref innerRef={this.componentRef}>
                            <BannerTable bannerType={bannerType}
                                         versionParts={getVersionParts(
                                             _.chain(featuredList)
                                                 .map((featured) => featured.versions)
                                                 .flatten()
                                                 .value()
                                         )}
                                         rundown={getRundowns(featuredList)}
                                         order={order}
                                         sortBy={sortBy}
                                         ref={this.componentRef}

                            />
                        </Ref>
                    </ScrollContainer>
                </Container>
                <Container style={{marginTop: '2em'}} textAlign={'center'}>
                    <PngDownloadButton node={this.componentRef} name={'banner-history'}
                                       type={bannerType}
                    />
                </Container>
            </>
        )
    }
}
