import React, {useState} from "react";
import {Rundown, VersionParts} from "@/banners/types";
import {Form, Icon, Image, Label, Table} from "semantic-ui-react";
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
        return {}
    }

    const lightness = 100 - Math.min(50, Math.floor(c * 2));
    return {
        backgroundColor: `hsl(0, 5%, ${lightness}%)`
    }
}

type BannerBreakdownProps = {bannerType: string, versionParts: VersionParts[], rundown: Rundown[]}
export function BannerRundown({bannerType, versionParts, rundown}: BannerBreakdownProps) {
    const [filterText, setFilterText] = useState("");

    function handleFilterChange(event: React.ChangeEvent<HTMLInputElement>) {
        setFilterText(event.target.value);
    }

    const filteredRundown = _.chain(rundown)
        .filter((r) => r.name.toLowerCase().includes(filterText.toLowerCase()))
        // .filter(isLimited)
        // .orderBy((rc) => banners.characters["5"][rc.name][banners.characters["5"][rc.name].length - 1], 'desc')
        .value()

    if (filteredRundown.length) {
        rundown = filteredRundown
    }



    return (
        <>
            <Table definition className={'history'}>
                <Table.Header>
                    <Table.Row>
                        <Table.HeaderCell className={'no-border'} style={{pointerEvents: 'auto', padding: '0 .5em'}}>
                            <Form.Input fluid
                                        placeholder={'Filter ' + bannerType + '...'}
                                        onChange={handleFilterChange}
                                        value={filterText}
                                        style={{minWidth: '12em'}} />
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
                                        <span>{r.name}</span> <Image avatar src={`/images/characters/${r.image}.png`}
                                                                     alt={r.image}/>
                                    </Table.Cell>
                                    <Table.Cell>
                                        <Label>{r.runs}</Label>
                                    </Table.Cell>
                                    {
                                        r.counter.map((c, cI) => <Table.Cell key={rI + "-" + cI}
                                                                             style={getCounterStyle(c)}>{getImageOrCounter(bannerType, r, c)}</Table.Cell>)
                                    }
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
                        {versionParts.map(function (vp, idx) {
                            return (
                                <Table.HeaderCell colSpan={vp.parts} key={idx}>{vp.version}</Table.HeaderCell>
                            )
                        })}
                    </Table.Row>
                </Table.Footer>
            </Table>
        </>
    );
}