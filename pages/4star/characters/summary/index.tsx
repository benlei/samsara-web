import {BannerSummary} from "@/banners/summary";
import React from "react";
import SummaryPage from "@/components/SummaryPage";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import Head from "next/head";

export async function getStaticProps() {
    dayjs.extend(utc);

    return {
        props: {
            banners: require('@/data/banners.json').characters['4'],
            date: dayjs.utc().toISOString().substring(0, 10)
        },
    };
}


export default function FourStarCharacterSummary(props: { banners: { [name: string]: BannerSummary }, date: string }) {
    return (
        <>
            <Head>
                <title>4&#x2605; Character Summary - Samsara</title>
            </Head>
            <SummaryPage
                title={<>4&#x2605; Character Summary</>}
                data={props}
                type={'characters'}
            />
        </>
    )
}