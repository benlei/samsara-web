import {ResourceBanner} from "@/banners/types";
import React from "react";
import {Image, Label, Table} from "semantic-ui-react";

type Properties = {
    rundown: ResourceBanner
    bannerType: string
}

type States = {}

function getImageOrCounter(type: string, rc: ResourceBanner, counter: number): React.ReactElement {
    if (counter == 0) {
        return <Image avatar src={`/images/${type}/${rc.image}.png`} alt={rc.image}/>

    }

    if (counter == -1) {
        return <div></div>

    }

    return <div>{counter}</div>
}

export default class BannerRow extends React.Component<Properties, States> {
    render() {
        const {
            rundown,
            bannerType
        } = this.props

        return (
            <Table.Row>
                <Table.Cell>
                    <span>
                        {rundown.name}
                    </span> <Image avatar
                                   src={`/images/${bannerType}/${rundown.image}.png`}
                                   alt={rundown.image}/>

                </Table.Cell>
                <Table.Cell className={'hc-0'}>
                    <Label>{rundown.runs}</Label>
                </Table.Cell>
                {rundown.counter.map((c, cI) => (
                    <Table.Cell key={cI} className={'hc-' + Math.max(0, Math.min(25, c))}>
                        {getImageOrCounter(bannerType, rundown, c)}
                    </Table.Cell>
                ))}
            </Table.Row>
        );
    }
}