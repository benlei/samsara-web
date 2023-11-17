import { LoadHSRBanners } from "@/banners/history";
import { Featured } from "@/banners/types";
import LastRunSummaryPage from "@/components/summary/LastRunSummaryPage";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import Head from "next/head";

export async function getStaticProps() {
  dayjs.extend(utc);
  return {
    props: {
      featuredList: LoadHSRBanners().fiveStarCharacters,
      date: dayjs.utc().toISOString().substring(0, 10),
    },
  };
}

export default function FiveStarCharacterSummary(props: {
  featuredList: Featured[];
  date: string;
}) {
  return (
    <>
      <Head>
        <title>5&#x2605; HSR Character Summary - Samsara</title>
      </Head>
      <LastRunSummaryPage
        title={<>5&#x2605; HSR Character Summary</>}
        data={props}
        type={"hsr-characters"}
      />
    </>
  );
}
