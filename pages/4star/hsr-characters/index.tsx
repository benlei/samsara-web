import { LoadHSRHistory } from "@/banners/history";
import { BannerHistoryDataset } from "@/banners/types";
import HistoryPage from "@/components/history/HistoryPage";
import Head from "next/head";
import { TypeContext } from "../../../components/context";

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
export default function FourStarCharactersHome({ dataset }: Properties) {
  return (
    <>
      <Head>
        <title>4&#x2605; HSR Character Banner History - Samsara</title>
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
          bannerType={"hsr-characters"}
          title={<>4&#x2605; HSR Character Banner History</>}
          dataset={dataset}
          featuredList={dataset.fourStarCharacters}
        />
      </TypeContext.Provider>
    </>
  );
}
