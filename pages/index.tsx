import LoadGenshinHistory from "@/banners/history";
import { BannerHistoryDataset } from "@/banners/types";
import HistoryPage from "@/components/history/HistoryPage";
import Head from "next/head";

export async function getStaticProps() {
  return {
    props: {
      dataset: LoadGenshinHistory(),
    },
  };
}

type Properties = {
  dataset: BannerHistoryDataset;
};

export default function FiveStarCharactersHome({ dataset }: Properties) {
  return (
    <>
      <Head>
        <title>5&#x2605; Character Banner History - Samsara</title>
      </Head>
      <HistoryPage
        bannerType={"characters"}
        title={<>5&#x2605; Character Banner History</>}
        dataset={dataset}
        featuredList={dataset.fiveStarCharacters}
      />
    </>
  );
}
