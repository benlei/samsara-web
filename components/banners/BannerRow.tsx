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
        return <div className={'cell'}></div>

    }

    return <div className={'cell'}>{counter}</div>
}

function getCounterStyle(c: number) {
    if (c == 0) {
        return {backgroundColor: '#fff'}
    }

    const lightness = 100 - Math.min(36, Math.floor(c * 1.5));
    return {
        backgroundColor: `hsl(0, 5%, ${lightness}%)`
    }
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
                <Table.Cell>
                    <Label>{rundown.runs}</Label>
                </Table.Cell>
                {rundown.counter.map((c, cI) => (
                    <Table.Cell key={cI} style={getCounterStyle(c)}>
                        {getImageOrCounter(bannerType, rundown, c)}
                    </Table.Cell>
                ))}
            </Table.Row>
        );
    }
}