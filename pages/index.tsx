import Head from 'next/head'
import {Banners, Rundown} from '@/banners/types'

import {
    Container, Icon,
    Image, Label,
    Table,
} from 'semantic-ui-react'
import {getRundown} from "@/banners/rundown";
import getVersionParts from "@/banners/version";
import _ from "lodash";
import React from "react";


export const getServerSideProps = async () => {

    return {
        props: {
            banners: require('@/data/banners.json')
        },
    };
};

type HomeProperties = {
    banners: Banners
}


function isLimited(rc: Rundown) {
    return rc.name != "Keqing" && rc.name != "Tighnari"
}

function getImageOrCounter(type: string, rc: Rundown, counter: number): React.ReactElement {
    if (counter == 0) {
        return (
            <Image avatar src={`/images/${type}/${rc.image}.png`} alt={rc.image}/>
        )
    }

    if (counter == -1) {
        return (
            <div style={{width: '2em', height: '2em'}}></div>
        )
    }

    return (
        <>
            {counter}
        </>
    )
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

export default function Home({banners}: HomeProperties) {
    let rundown = getRundown(banners.characters["5"])
    rundown = _.chain(rundown)
        .filter(isLimited)
        // .orderBy((rc) => banners.characters["5"][rc.name][banners.characters["5"][rc.name].length - 1], 'desc')
        .value()

    const versionParts = getVersionParts(banners.characters["5"])
    return (
        <>
            <Head>
                {/*<title>Create Next App</title>*/}
                {/*<meta name="description" content="Generated by create next app" />*/}
                {/*<meta name="viewport" content="width=device-width, initial-scale=1" />*/}
                {/*<link rel="icon" href="/favicon.ico" />*/}
            </Head>
            <Container style={{marginTop: '7em', overflowX: 'scroll'}}>
                <Table definition className={'history'}>
                    <Table.Header>
                        <Table.Row>
                            <Table.HeaderCell className={'no-border'}/>
                            <Table.HeaderCell>
                                <Icon name='redo' />
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
                                            <span>{r.name}</span> <Image avatar src={`/images/characters/${r.image}.png`} alt={r.image}/>
                                        </Table.Cell>
                                        <Table.Cell>
                                            <Label>{r.runs}</Label>
                                        </Table.Cell>
                                        {
                                            r.counter.map((c, cI) => <Table.Cell key={rI + "-" + cI} style={getCounterStyle(c)}>{getImageOrCounter('characters', r, c)}</Table.Cell>)
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
                                <Icon name='redo' />
                            </Table.HeaderCell>
                            {versionParts.map(function (vp, idx) {
                                return (
                                    <Table.HeaderCell colSpan={vp.parts} key={idx}>{vp.version}</Table.HeaderCell>
                                )
                            })}
                        </Table.Row>
                    </Table.Footer>
                </Table>
            </Container>
        </>
    )
}
