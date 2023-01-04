import Head from 'next/head'
import {BannerResource} from '@/banners/types'
import React from "react";
import BannerPage from "@/components/banners/BannerPage";


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
            <BannerPage bannerType={'characters'}
                        banners={banners}
                        showLimitedOnly={false}
            />
        </>
    )
}
