import React from "react";
import {Container, Loader} from "semantic-ui-react";
import BannerOptions from "@/components/banners/BannerOptions";
import BannerTable from "@/components/banners/BannerTable";
import getVersionParts from "@/banners/version";
import {getRundowns} from "@/banners/rundown";
import BannerDownload from "@/components/banners/BannerDownload";
import {BannerResource} from "@/banners/types";
import ScrollContainer from "react-indiana-drag-scroll";

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
    expand: boolean | null
    ssr: boolean
}

export default class BannerPage extends React.Component<Properties, States> {
    private componentRef: React.RefObject<any>

    constructor(props: Readonly<Properties> | Properties) {
        super(props);

        this.state = {
            limitedOnly: null,
            sortBy: null,
            order: null,
            expand: null,
            ssr: true,
        }

        this.componentRef = React.createRef()
    }


    componentDidMount=() => this.setState({ssr: false})

    render() {
        // the html page is huge (+100kb)
        if (this.state.ssr) {
            return (
                <Loader active inline='centered' style={{marginTop: '2em'}} />
            )
        }

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
                <Container style={{marginTop: '2em'}}>
                    <BannerOptions showLimitedOnly={showLimitedOnly} limitedOnly={limitedOnly}
                                            setLimitedOnly={setLimitedOnly}
                                            order={order} setOrder={setOrder}
                                            sortBy={sortBy} setSortBy={setSortBy}
                                            expand={expand} setExpand={setExpand}
                    />
                </Container>
                <Container style={{overflowX: 'scroll', ...getBannerContainerStyle(expand ?? false)}} fluid={expand ?? false}>
                    <ScrollContainer className="scroll-container" hideScrollbars={false} ignoreElements={'input'}>
                        <BannerTable bannerType={bannerType}
                                              versionParts={getVersionParts(banners)}
                                              rundown={getRundowns(banners)}
                                              limitedOnly={limitedOnly}
                                              order={order}
                                              sortBy={sortBy}
                                              standards={standards}
                                              ref={this.componentRef}

                        />
                    </ScrollContainer>
                </Container>
                <Container style={{marginTop: '2em'}}>
                    <BannerDownload bannerRef={this.componentRef}/>
                </Container>
            </>
        )
    }
}
