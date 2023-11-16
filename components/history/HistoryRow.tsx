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

// thanks ChatGPT
const findLastSegment = (counter: number[]): number => {
  let startIndex = counter.length;
  for (let i = counter.length - 1; i >= 0; i--) {
    if (counter[i] !== -1) {
      startIndex = i + 1;
      break;
    }
  }

  return startIndex;
};

export default function HistoryRow({
  rundown,
  bannerType,
  dataset,
}: Properties): JSX.Element {
  const [open, setOpen] = useState(false);

  let versionIndex = 0;
  let lastSegment = findLastSegment(rundown.counter);

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
      {rundown.counter.slice(0, lastSegment).map((c, cI) => (
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
      {lastSegment != rundown.counter.length ? (
        <Table.Cell
          colSpan={rundown.counter.length - lastSegment}
          className={"hc-0"}
        ></Table.Cell>
      ) : null}
    </Table.Row>
  );
}
