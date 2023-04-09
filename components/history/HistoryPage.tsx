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
    standards?: string[]
    showLimitedOnly: boolean
}

type States = {
    limitedOnly: boolean
    sortBy: string
    order: string
    expand: boolean
}

export default class HistoryPage extends React.Component<Properties, States> {
    private componentRef: React.RefObject<any>

    constructor(props: Readonly<Properties> | Properties) {
        super(props);

        this.state = {
            limitedOnly: true,
            sortBy: 'last',
            order: 'desc',
            expand: false,
        }

        this.componentRef = React.createRef()
    }

    render() {
        const {
            featuredList,
            bannerType,
            standards,
            showLimitedOnly,
        } = this.props

        const {
            limitedOnly,
            sortBy,
            order,
            expand,
        } = this.state


        const setLimitedOnly = (v: boolean) => this.setState({limitedOnly: v})
        const setSortBy = (v: string) => this.setState({sortBy: v})
        const setOrder = (v: string) => this.setState({order: v})
        const setExpand = (v: boolean) => this.setState({expand: v})

        const getBannerContainerStyle = (expand: boolean) => {
            if (expand) {
                return {
                    paddingLeft: '1em',
                    paddingRight: '1em',
                }
            }

            return {}
        }

        return (
            <>
                <Container style={{marginTop: '1em'}}>
                    <HistoryOptions showLimitedOnly={showLimitedOnly} limitedOnly={limitedOnly}
                                    setLimitedOnly={setLimitedOnly}
                                    order={order} setOrder={setOrder}
                                    sortBy={sortBy} setSortBy={setSortBy}
                                    expand={expand} setExpand={setExpand}
                    />
                </Container>
                <Container style={{marginTop: '1em', ...getBannerContainerStyle(expand ?? false)}}
                           fluid={expand ?? false}>
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
                                         limitedOnly={limitedOnly}
                                         order={order}
                                         sortBy={sortBy}
                                         standards={standards}
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
