import { LoadGenshinBanners } from "@/banners/history";
import { Featured } from "@/banners/types";
import RunsSummaryPage from "@/components/summary/RunsSummaryPage";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import Head from "next/head";

export async function getStaticProps() {
  dayjs.extend(utc);
  return {
    props: {
      featuredList: LoadGenshinBanners().fiveStarCharacters,
    },
  };
}

export default function FiveStarCharacterSummary(props: {
  featuredList: Featured[];
}) {
  return (
    <>
      <Head>
        <title>5&#x2605; Character Reruns Summary - Samsara</title>
      </Head>
      <RunsSummaryPage
        title={<>5&#x2605; Character Reruns Summary</>}
        data={props}
        type={"characters"}
      />
    </>
  );
}
