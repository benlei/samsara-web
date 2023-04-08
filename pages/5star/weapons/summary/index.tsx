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
            banners: require('@/data/banners.json').weapons['5'],
            date: dayjs.utc().toISOString().substring(0, 10)
        },
    };
}


export default function FiveStarWeaponSummary(props: { banners: { [name: string]: BannerSummary }, date: string }) {

    return (
        <>
            <Head>
                <title>5&#x2605; Weapon Summary - Samsara</title>
            </Head>
            <SummaryPage
                title={<>5&#x2605; Weapon Summary</>}
                data={props}
                type={'weapons'}
            />
        </>
    )
}