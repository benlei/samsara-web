import Head from 'next/head'
import {BannerResource} from '@/banners/types'
import React from "react";
import BannerPage from "@/components/banners/BannerPage";
import {Container, Header} from "semantic-ui-react";
import _ from "lodash";


export async function getStaticProps() {
    return {
        props: {
            banners: _.mapValues(require('@/data/banners.json').characters['5'], (v) => v.versions)
        },
    };
}

type Properties = {
    banners: BannerResource
}

export default function FiveStarCharactersHome({banners}: Properties) {
    return (
        <>
            <Head>
                <title>5&#x2605; Character Banner History - Samsara</title>
            </Head>
            <Container style={{marginTop: '2em'}}>
                <Header size={'large'}>5&#x2605; Character Banner History</Header>
            </Container>
            <BannerPage bannerType={'characters'}
                        banners={banners}
                        standards={['Keqing', 'Tighnari']}
                        showLimitedOnly={true}

            />
        </>
    )
}
