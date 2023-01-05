import {BannerSummary} from "@/banners/summary";
import React from "react";
import SummaryPage from "@/components/SummaryPage";

export async function getStaticProps() {
    return {
        props: {
            banners: require('@/data/bannersSummary.json').characters['4']
        },
    };
}


export default function FourStarCharacterSummary(props: { banners: { [name: string]: BannerSummary } }) {

    return (
        <SummaryPage
            title={'4★ Character Summary'}
            data={props}
            type={'characters'}
        />
    )
}