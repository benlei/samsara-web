import {BannerSummary} from "@/banners/summary";
import React from "react";
import SummaryPage from "@/components/SummaryPage";

export async function getStaticProps() {
    return {
        props: {
            banners: require('@/data/bannersSummary.json').characters['5']
        },
    };
}


export default function FiveStarCharacterSummary(props: { banners: { [name: string]: BannerSummary } }) {

    return (
        <SummaryPage
            title={'5★ Character Summary'}
            data={props}
            type={'characters'}
            standard={['Keqing', 'Tighnari']}
        />
    )
}