import Head from 'next/head'
import {FeaturedHistory} from '@/banners/types'
import React from "react";
import HistoryPage from "@/components/history/HistoryPage";
import {Container, Header} from "semantic-ui-react";
import _ from "lodash";
import YAML from "yaml";
import fs from "fs";
import path from "path";


export async function getStaticProps() {
    return {
        props: {
            featuredList: _.chain(YAML.parse(fs.readFileSync(path.resolve('./public/data/banners.yaml'), 'utf8')).fiveStarCharacters)
                .map((featured) => _.omit(featured, 'dates'))
                .value(),
        },
    };
}

type Properties = {
    featuredList: FeaturedHistory[]
}

export default function FiveStarCharactersHome({featuredList}: Properties) {
    return (
        <>
            <Head>
                <title>5&#x2605; Character Banner History - Samsara</title>
            </Head>
            <Container style={{marginTop: '2em'}}>
                <Header size={'large'}>5&#x2605; Character Banner History</Header>
            </Container>
            <HistoryPage bannerType={'characters'}
                         featuredList={featuredList}
                         standards={['Keqing', 'Tighnari']}
                         showLimitedOnly={true}

            />
        </>
    )
}
