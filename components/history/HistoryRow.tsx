import {BannerHistoryDataset, DetailedFeaturedHistory, FeaturedHistory} from "@/banners/types";
import React from "react";
import {Image, Popup, Table} from "semantic-ui-react";
import HistoryFeaturedPopover from "@/components/history/HistoryFeaturedPopover";
import HistoryImageCounter from "@/components/history/HistoryImageCounter";

type Properties = {
    rundown: DetailedFeaturedHistory
    bannerType: string
    featuredList: FeaturedHistory[]
    dataset: BannerHistoryDataset
}

type States = {
    open: boolean
}

export default class HistoryRow extends React.Component<Properties, States> {
    constructor(props: Readonly<Properties> | Properties) {
        super(props);


        this.state = {
            open: false,
        }
    }

    setOpen = (open: boolean) => {
        this.setState({open})
    }

    render() {
        const {
            rundown,
            bannerType,
            featuredList,
            dataset,
        } = this.props

        let versionIndex = 0;
        return (
            <Table.Row>
                <Table.Cell>
                    <Popup
                        content={<HistoryFeaturedPopover type={bannerType} rundown={rundown}/>}
                        on='click'
                        onClose={() => this.setOpen(false)}
                        onOpen={() => this.setOpen(true)}
                        open={this.state.open}
                        position={'right center'}
                        trigger={
                            <span>
                                <span className={'desktop'}>
                                    {rundown.name}
                                </span> <Image avatar
                                               src={`/images/${bannerType}/${rundown.image}.png`}
                                               alt={rundown.image}/>
                            </span>}
                    />
                </Table.Cell>
                <Table.Cell className={'hc-0'}>
                    <div className={'runs'}>{rundown.runs}</div>
                </Table.Cell>
                {rundown.counter.map((c, cI) => (
                    <Table.Cell key={cI} className={'hc-' + Math.max(0, Math.min(25, c))}>
                        <HistoryImageCounter
                            type={bannerType}
                            dataset={dataset}
                            rundown={rundown}
                            counter={c}
                            versionIndex={c === 0 ? versionIndex++ : versionIndex}
                        />
                    </Table.Cell>
                ))}
            </Table.Row>
        );
    }
}