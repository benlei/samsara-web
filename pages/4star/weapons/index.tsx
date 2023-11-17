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

export default function FourStarWeaponsHome({ dataset }: Properties) {
  return (
    <>
      <Head>
        <title>4&#x2605; Weapon Banner History - Samsara</title>
      </Head>
      <HistoryPage
        bannerType={"weapons"}
        title={<>4&#x2605; Weapon Banner History</>}
        dataset={dataset}
        featuredList={dataset.fourStarWeapons}
      />
    </>
  );
}
