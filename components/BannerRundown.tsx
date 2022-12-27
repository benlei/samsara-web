import React, {Dispatch, SetStateAction, useState} from "react";
import {BannerOptions, Rundown, VersionParts} from "@/banners/types";
import {Form, Icon, Image, Label, Sticky, Table} from "semantic-ui-react";
import _ from "lodash";


function isLimited(rc: Rundown) {
    return rc.name != "Keqing" && rc.name != "Tighnari"
}

function getImageOrCounter(type: string, rc: Rundown, counter: number): React.ReactElement {
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

type BannerRundownProps = {
    bannerType: string
    versionParts: VersionParts[]
    rundown: Rundown[]
} & BannerOptions

type BannerRundownState = {
    filterText: string | null
}

export default class BannerRundownComponent extends React.Component<BannerRundownProps, BannerRundownState> {
    constructor(props: BannerRundownProps) {
        super(props);
        this.state = {
            filterText: null
        }
    }


    private getFilteredRundown(filterText: string) {
        let filterFunc = (r: Rundown) => r.name.toLowerCase().includes(filterText!.toLowerCase())
        if (filterText.startsWith('/') && filterText.endsWith('/')) {
            try {
                const re = new RegExp(filterText.substring(1, filterText.length - 1), 'i')
                filterFunc = (r: Rundown) => re.test(r.name)
            } catch (ignore) {

            }
        }

        const filteredRundown = _.chain(this.props.rundown)
            .filter(filterFunc)
            // .filter(isLimited)
            // .orderBy((rc) => banners.characters["5"][rc.name][banners.characters["5"][rc.name].length - 1], 'desc')
            .value()

        if (filteredRundown.length) {
            return filteredRundown
        }
        return this.props.rundown;
    }

    handleFilterChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        this.setState({filterText: event.target.value});
    }

    componentDidMount = () => {
        this.setState({filterText: ''});
    }

    render() {
        let {versionParts, bannerType, rundown} = this.props
        let {filterText} = this.state
        if (filterText) {
            rundown = this.getFilteredRundown(filterText);
        }

        return (
            <>
                <Table definition unstackable selectable className={'history'} style={{marginTop: '1em'}}>
                    <Table.Header>
                        <Table.Row>
                            <Table.HeaderCell className={'no-border'}
                                              style={{pointerEvents: 'auto', padding: '0 .5em'}}>
                                <Form.Input fluid
                                            placeholder={'Filter ' + bannerType + '...'}
                                            onChange={this.handleFilterChange}
                                            value={this.state.filterText}
                                            style={{minWidth: '12em'}}/>
                            </Table.HeaderCell>
                            <Table.HeaderCell>
                                <Icon name='redo'/>
                            </Table.HeaderCell>
                            {versionParts.map(function (vp, idx) {
                                return (
                                    <Table.HeaderCell colSpan={vp.parts} key={idx}>{vp.version}</Table.HeaderCell>
                                )
                            })}
                        </Table.Row>
                    </Table.Header>

                    <Table.Body>
                        {
                            rundown.map(function (r, rI) {
                                return (
                                    <Table.Row key={rI}>
                                        <Table.Cell>
                                            <span>
                                                {r.name}
                                            </span> <Image avatar
                                                   src={`/images/characters/${r.image}.png`}
                                                   alt={r.image}/>
                                        </Table.Cell>
                                        <Table.Cell>
                                            <Label>{r.runs}</Label>
                                        </Table.Cell>
                                        {r.counter.map((c, cI) => (
                                            <Table.Cell key={rI + "-" + cI} style={getCounterStyle(c)}>
                                                {getImageOrCounter(bannerType, r, c)}
                                            </Table.Cell>
                                        ))}
                                    </Table.Row>
                                )
                            })
                        }
                    </Table.Body>

                    <Table.Footer>
                        <Table.Row>
                            <Table.HeaderCell className={'no-border'}/>
                            <Table.HeaderCell>
                                <Icon name='redo'/>
                            </Table.HeaderCell>
                            {versionParts.map((vp, idx) => (
                                <Table.HeaderCell colSpan={vp.parts} key={idx}>
                                    {vp.version}
                                </Table.HeaderCell>
                            ))}
                        </Table.Row>
                    </Table.Footer>
                </Table>
            </>
        );

    }

}