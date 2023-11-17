import { LoadHSRHistory } from "@/banners/history";
import { BannerHistoryDataset } from "@/banners/types";
import { TypeContext } from "@/components/context";
import HistoryPage from "@/components/history/HistoryPage";
import Head from "next/head";

export async function getStaticProps() {
  return {
    props: {
      dataset: LoadHSRHistory(),
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
        <title>4&#x2605; Lightcone Banner History - Samsara</title>
      </Head>
      <TypeContext.Provider
        value={{
          charactersText: "Characters",
          characterType: "hsr-characters",
          weaponsText: "Lightcones",
          weaponType: "lightcones",
        }}
      >
        <HistoryPage
          bannerType={"lightcones"}
          title={<>4&#x2605; Lightcone Banner History</>}
          dataset={dataset}
          featuredList={dataset.fourStarWeapons}
        />
      </TypeContext.Provider>
    </>
  );
}
