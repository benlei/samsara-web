import {
  BannerHistoryDataset,
  DetailedFeaturedHistory,
  FeaturedHistory,
} from "@/banners/types";
import React, { useEffect, useState } from "react";
import { Image, Popup, Table } from "semantic-ui-react";
import HistoryFeaturedPopover from "@/components/history/HistoryFeaturedPopover";
import HistoryImageCounter from "@/components/history/HistoryImageCounter";

type Properties = {
  rundown: DetailedFeaturedHistory;
  bannerType: string;
  featuredList: FeaturedHistory[];
  dataset: BannerHistoryDataset;
};

export default function HistoryRow({
  rundown,
  bannerType,
  dataset,
}: Properties): React.ReactElement {
  const [open, setOpen] = useState(false);

  let versionIndex = 0;

  return (
    <Table.Row>
      <Table.Cell>
        <Popup
          content={
            <HistoryFeaturedPopover type={bannerType} rundown={rundown} />
          }
          on="click"
          onClose={() => setOpen(false)}
          onOpen={() => setOpen(true)}
          open={open}
          position={"right center"}
          trigger={
            <span>
              <span className={"desktop"}>{rundown.name}</span>{" "}
              <Image
                avatar
                src={`/images/${bannerType}/${rundown.image}.png`}
                alt={rundown.image}
              />
            </span>
          }
        />
      </Table.Cell>
      <Table.Cell className={"hc-0"}>
        <div className={"runs"}>{rundown.runs}</div>
      </Table.Cell>
      {rundown.counter.map((c, cI) => (
        <Table.Cell key={cI} className={"hc-" + Math.max(0, Math.min(25, c))}>
          <HistoryImageCounter
            type={bannerType}
            dataset={dataset}
            rundown={rundown}
            counter={c}
            versionIndex={c === 0 ? versionIndex++ : versionIndex}
          />
        </Table.Cell>
      ))}
    </Table.Row>
  );
}
