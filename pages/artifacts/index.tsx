import React from "react";
import Head from "next/head";
import {Container} from "semantic-ui-react";


// TODO: make this page instead show all the "show on overview" presets

export async function getStaticProps() {
    return {
        props: {
            characters: require('@/data/characters.json'),
            artifacts: require('@/data/artifacts.json'),
        },
    };
}

export default function ArtifactRotationsOverview() {
    return (
        <>
            <Head>
                <title>Artifact Rotations - Samsara</title>
            </Head>

            <Container style={{marginTop:'2em'}}>
                <p>
                    This is the Genshin Impact End Game: Artifact farming. You can use this tool however you like.
                    Personally I don&#39;t upgrade any artifacts until the end of 1 domain rotation, which for me is the
                    equivalent of about 7 days. I find that this helps reduce the anxiety and disappointment
                    of seeing all the artifacts I farmed for the day turn into, well, trash. Especially because
                    usually, for me, at least 1 decent-ish piece (3 hits into CRIT) is possible within a week of
                    artifact farming.
                </p>
                <p>
                    It looks like you haven&#39;t set up any rotation yet. Head on over to the <a
                    href={'/artifacts/manage'}>Manage Artifact Rotation</a> page to get started, or to your <a
                    href={'/artifacts/presets'}>Artifact Presets</a> in order to setup multiple presets/accounts.
                </p>
            </Container>
        </>
    )
}