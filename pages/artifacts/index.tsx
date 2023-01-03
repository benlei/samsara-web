import React, {useEffect, useState} from "react";
import Head from "next/head";
import {Container, Header, Table} from "semantic-ui-react";
import {
    ArtifactRotationSummaryProperties,
    ArtifactsArtifactDomains,
    ArtifactJsonProperties,
    RotationStorage
} from "@/artifacts/types";
import {V1StorageKey} from "@/artifacts/presets";
import _ from "lodash";
import {getArtifactDomains, getArtifacts} from "@/artifacts/artifacts";
import PresetCurrentNextCells from "@/components/artifacts/PresetCurrentNextCells";
import {getCharacters} from "@/characters/characters";


export async function getStaticProps() {
    return {
        props: {
            characters: require('@/data/characters.json'),
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

    const data: ArtifactRotationSummaryProperties = {
        artifacts: getArtifacts(artifacts),
        domains: getArtifactDomains(artifacts),
        characters: getCharacters(characters),
    }

    return (
        <>
            <Head>
                <title>Artifact Rotations - Samsara</title>
            </Head>

            <Container style={{marginTop: '2em'}}>
                <Header size={'large'}>Artifact Rotations Overview</Header>
                <p>
                    This is the Genshin Impact End Game: Artifact farming. You can use this tool however you like.
                    Personally I don&#39;t upgrade any artifacts until the end of 1 domain rotation, which for me is the
                    equivalent of about 7 days. I find that this helps reduce the anxiety and disappointment
                    of seeing all the artifacts I farmed for the day turn into, well, trash. Especially because
                    usually, for me, at least 1 decent-ish piece (3 hits into CRIT) is possible within a week of
                    artifact farming.
                </p>
                {!hasRotation() ? (
                    <p>
                        It looks like you haven&#39;t set up any rotation yet. Head on over to the <a
                        href={'/artifacts/manage'}>Manage Artifact Rotation</a> page to get started, or to your <a
                        href={'/artifacts/presets'}>Artifact Presets</a> in order to setup multiple presets/accounts.
                    </p>
                ) : (
                    <>
                        <Container fluid style={{marginTop: '1em'}} className={'artifact-rotations'}>
                            <Table unstackable>
                                <Table.Header>
                                    <Table.Row>
                                        <Table.HeaderCell style={{width: '3rem'}}>#</Table.HeaderCell>
                                        <Table.HeaderCell>Preset</Table.HeaderCell>
                                        <Table.HeaderCell style={{width: '30rem'}}>Current Rotation</Table.HeaderCell>
                                        <Table.HeaderCell style={{width: '30rem'}}>Next Rotation</Table.HeaderCell>
                                    </Table.Row>
                                    {storage.presets.map((preset, k) =>
                                        preset.rotations.length ? (
                                            <Table.Row key={k}>
                                                <Table.Cell verticalAlign={'top'}>{k+1}</Table.Cell>
                                                <Table.Cell verticalAlign={'top'}>{preset.name}</Table.Cell>
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
        </>
    )
}