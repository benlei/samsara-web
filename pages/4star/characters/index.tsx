import Head from 'next/head'
import {BannerResource} from '@/banners/types'
import React from "react";
import BannerPage from "@/components/banners/BannerPage";
import {Container, Header} from "semantic-ui-react";


export async function getStaticProps() {
    return {
        props: {
            banners: require('@/data/banners.json').characters['4']
        },
    };
}

type Properties = {
    banners: BannerResource
}

export default function FourStarCharactersHome({banners}: Properties) {

    return (
        <>
            <Head>
                <title>4&#x2605; Character Banner History - Samsara</title>
            </Head>
            <Container style={{marginTop: '2em'}}>
                <Header size={'large'}>4&#x2605; Character Banner History</Header>
            </Container>
            <BannerPage bannerType={'characters'}
                        banners={banners}
                        showLimitedOnly={false}
            />
        </>
    )
}
