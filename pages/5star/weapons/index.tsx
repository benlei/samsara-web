import Head from 'next/head'
import {BannerResource} from '@/banners/types'
import React from "react";
import BannerPage from "@/components/banners/BannerPage";


export async function getStaticProps() {
    return {
        props: {
            banners: require('@/data/banners.json').weapons['5']
        },
    };
}

type Properties = {
    banners: BannerResource
}

export default function FiveStarWeaponsHome({banners}: Properties) {
    return (
        <>
            <Head>
                <title>5&#x2605; Weapon Banner History - Samsara</title>
                {/*<meta name="description" content="Generated by create next app" />*/}
                {/*<meta name="viewport" content="width=device-width, initial-scale=1" />*/}
                {/*<link rel="icon" href="/favicon.ico" />*/}
            </Head>
            <BannerPage bannerType={'weapons'}
                        banners={banners}
                        showLimitedOnly={false}
            />
        </>
    )
}
