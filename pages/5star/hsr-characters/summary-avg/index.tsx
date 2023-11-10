import React from "react";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import Head from "next/head";
import {Featured} from "@/banners/types";
import YAML from "yaml";
import fs from "fs";
import path from "path";
import AverageRunSummaryPage from "@/components/summary/AverageRunSummaryPage";

export async function getStaticProps() {
    dayjs.extend(utc);
    return {
        props: {
            featuredList: YAML.parse(fs.readFileSync(path.resolve('./public/data/hsr-banners.yaml'), 'utf8')).fiveStarCharacters,
        },
    };
}


export default function FiveStarCharacterSummary(props: { featuredList: Featured[] }) {
    return (
        <>
            <Head>
                <title>5&#x2605; HSR Character Average Summary - Samsara</title>
            </Head>
            <AverageRunSummaryPage
                title={<>5&#x2605; HSR Character Average Summary</>}
                data={props}
                type={'hsr-characters'}
            />
        </>
    )
}