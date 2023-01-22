import React, {useEffect, useState} from "react";
import Head from "next/head";
import {Container, Header, Table} from "semantic-ui-react";
import {
    ArtifactJsonProperties,
    ArtifactRotationSummaryProperties,
    RotationPreset,
    RotationStorage
} from "@/artifacts/types";
import {V1StorageKey} from "@/artifacts/presets";
import _ from "lodash";
import {getArtifactDomains, getArtifacts} from "@/artifacts/artifacts";
import PresetCurrentNextCells from "@/components/artifacts/PresetCurrentNextCells";
import {addOneOffCharacters, getCharacters} from "@/characters/characters";
import Link from "next/link";
import {useRouter} from "next/router";
import {nanoid} from "nanoid";
import Stale from "@/components/Stale";


export async function getStaticProps() {
    return {
        props: {
            characters: addOneOffCharacters([
                ...Object.keys(require('@/data/banners.json').characters['5']),
                ...Object.keys(require('@/data/banners.json').characters['4']),
            ]),
            artifacts: require('@/data/artifacts.json'),
        },
    };
}

type Properties = {
    characters: string[]
    artifacts: ArtifactJsonProperties
}

export default function ArtifactRotationsOverview(
    {
        characters,
        artifacts,
    }: Properties
) {
    const router = useRouter()
    const [stale, setStale] = useState(false)
    const [storage, setStorage] = useState<RotationStorage>({
        active: 0,
        cacheId: '',
        presets: []
    })

    function hasRotation(): boolean {
        return _.chain(storage.presets)
            .map((p) => p.rotations && p.rotations.length > 0)
            .reduce((result, n) => result || n, false)
            .value()
    }

    useEffect(() => {
        try {
            const rotationStorage: RotationStorage = JSON.parse(localStorage.getItem(V1StorageKey) || "{}")

            if (_.isNil(rotationStorage?.active)) {
                return
            }

            if (rotationStorage.cacheId != storage.cacheId) {
                setStorage((oldStorage) => rotationStorage)
            }
        } catch (ignore) {

        }
    }, [storage])

    function redirectTo(e: React.MouseEvent<HTMLAnchorElement, MouseEvent>, index: number) {
        e.preventDefault()
        const rotationStorage: RotationStorage | null = JSON.parse(localStorage.getItem(V1StorageKey) || "{}")

        if (storage.cacheId != '' && rotationStorage?.cacheId != storage.cacheId) {
            setStale(true)
            return
        }

        const newStorage = {
            active: index,
            cacheId: nanoid(),
            presets: _.cloneDeep<RotationPreset[]>(storage.presets),
        }
        localStorage.setItem(V1StorageKey, JSON.stringify(newStorage))
        router.push('/artifacts/manage')
    }

    const data: ArtifactRotationSummaryProperties = {
        artifacts: getArtifacts(artifacts),
        domains: getArtifactDomains(artifacts),
        characters: getCharacters(characters),
    }

    return (
        <>
            <Head>
                <title>Artifact Rotations Overview - Samsara</title>
            </Head>

            {stale ? (
                <Stale/>
            ) : (
                <Container style={{marginTop: '2em'}}>
                    <Header size={'large'}>Artifact Rotations Overview</Header>
                    <p>
                        If you have ever wanted to keep track of what artifact domains you want to do and for what
                        characters,
                        then this tool is for you! You can setup artifact rotations with different presets too, which
                        can be
                        utilized for people with multiple accounts. Once set up this tool can tell you which domain to
                        farm, and for how much longer.
                    </p>
                    {!hasRotation() ? (
                        <p>
                            It looks like you haven&#39;t set up any rotation yet. Head on over to the <a
                            href={'/artifacts/manage'}>Manage Artifact Rotation</a> page to get started, or to your <a
                            href={'/artifacts/presets'}>Artifact Presets</a> in order to setup multiple
                            presets/accounts.
                        </p>
                    ) : (
                        <>
                            <Container fluid style={{marginTop: '1em'}} className={'artifact-rotations'}>
                                <Table unstackable>
                                    <Table.Header>
                                        <Table.Row>
                                            <Table.HeaderCell style={{width: '3rem'}}>#</Table.HeaderCell>
                                            <Table.HeaderCell>Preset</Table.HeaderCell>
                                            <Table.HeaderCell style={{width: '30rem'}}>Current
                                                Rotation</Table.HeaderCell>
                                            <Table.HeaderCell style={{width: '30rem'}}>Next Rotation</Table.HeaderCell>
                                        </Table.Row>
                                        {storage.presets.map((preset, k) =>
                                            preset.rotations.length ? (
                                                <Table.Row key={k}>
                                                    <Table.Cell verticalAlign={'top'}>{k + 1}</Table.Cell>
                                                    <Table.Cell verticalAlign={'top'}>
                                                        {preset.name}
                                                        <p>
                                                            <Link href={'/artifacts/manage'}
                                                                  onClick={(e) => redirectTo(e, k)}>Manage</Link>
                                                        </p>
                                                    </Table.Cell>
                                                    <PresetCurrentNextCells preset={preset} data={data}/>
                                                </Table.Row>
                                            ) : (
                                                <React.Fragment key={k}></React.Fragment>
                                            )
                                        )}
                                    </Table.Header>
                                </Table>
                            </Container>
                        </>
                    )}
                </Container>
            )}
        </>
    )
}
