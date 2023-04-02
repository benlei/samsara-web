import Head from 'next/head'
import {BannerResource} from '@/banners/types'
import React from "react";
import HistoryPage from "@/components/history/HistoryPage";
import {Container, Header} from "semantic-ui-react";
import _ from "lodash";


export async function getStaticProps() {
    return {
        props: {
            banners: _.mapValues(require('@/data/banners.json').weapons['4'], (v) => v.versions)
        },
    };
}

type Properties = {
    banners: BannerResource
}

export default function FourStarWeaponsHome({banners}: Properties) {
    return (
        <>
            <Head>
                <title>4&#x2605; Weapon Banner History - Samsara</title>
            </Head>
            <Container style={{marginTop: '2em'}}>
                <Header size={'large'}>4&#x2605; Weapon Banner History</Header>
            </Container>
            <HistoryPage bannerType={'weapons'}
                         banners={banners}
                         showLimitedOnly={false}
            />
        </>
    )
}
