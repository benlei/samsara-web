import Head from 'next/head'
import {FeaturedHistory} from '@/banners/types'
import React from "react";
import HistoryPage from "@/components/history/HistoryPage";
import _ from "lodash";
import YAML from "yaml";
import fs from "fs";
import path from "path";


export async function getStaticProps() {
    return {
        props: {
            featuredList: _.chain(YAML.parse(fs.readFileSync(path.resolve('./public/data/banners.yaml'), 'utf8')).fourStarCharacters)
                .map((featured) => _.omit(featured, 'dates'))
                .value(),
        },
    };
}

type Properties = {
    featuredList: FeaturedHistory[]
}

export default function FourStarCharactersHome({featuredList}: Properties) {

    return (
        <>
            <Head>
                <title>4&#x2605; Character Banner History - Samsara</title>
            </Head>
            <HistoryPage bannerType={'characters'}
                         title={<>4&#x2605; Character Banner History</>}
                         featuredList={featuredList}
            />
        </>
    )
}
