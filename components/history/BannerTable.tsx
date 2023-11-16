import React, { useEffect, useState } from "react";
import {
  BannerFilterSortOptions,
  BannerHistoryDataset,
  FeaturedHistory,
} from "@/banners/types";
import { Table } from "semantic-ui-react";
import _ from "lodash";
import HistoryHeader from "@/components/history/HistoryHeader";
import HistoryFooter from "@/components/history/HistoryFooter";
import HistoryRow from "@/components/history/HistoryRow";
import { getFilterFunction } from "@/banners/summary";
import getVersionParts, { versionToNumber } from "@/banners/version";
import { getRundowns } from "@/banners/rundown";

const InitialNumberOfColumns = 30;
const InitialNumberOfRows = 30;

type BannerRundownProps = {
  bannerType: string;
  featuredList: FeaturedHistory[];
  dataset: BannerHistoryDataset;
} & BannerFilterSortOptions;

const sortByName = (r: FeaturedHistory) => r.name;

const sortByRunsLastPatch = [
  (r: FeaturedHistory) => String(r.versions.length),
  (r: FeaturedHistory) => versionToNumber(r.versions[r.versions.length - 1]),
  sortByName,
];

const sortByFirst = [
  (r: FeaturedHistory) => versionToNumber(r.versions[0]),
  sortByName,
];

const sortByLast = [
  (r: FeaturedHistory) => versionToNumber(r.versions[r.versions.length - 1]),
  sortByName,
];

export default function BannerTable({
  bannerType,
  featuredList,
  dataset,
  sortBy,
  order,
}: BannerRundownProps) {
  const [filterText, setFilterText] = useState("");
  const [loaded, setLoaded] = useState(false);

  useEffect(() => setLoaded(true));

  const getSortFunction = () => {
    switch (sortBy) {
      default:
      case "last":
        return sortByLast;
      case "first":
        return sortByFirst;
      case "runs-last":
        return sortByRunsLastPatch;
    }
  };

  const getOrderByOrders = () => {
    switch (sortBy) {
      default:
        return [
          ...Array(getSortFunction().length - 1).fill(
            order === "asc" ? "asc" : "desc"
          ),
          order === "asc" ? "desc" : "asc",
        ];
      case "runs-last":
        return order === "asc"
          ? ["asc", "desc", "desc"]
          : ["desc", "desc", "asc"];
    }
  };

  const handleFilterChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setFilterText(event.target.value);
  };

  const versionParts = getVersionParts(
    _.chain(featuredList)
      .map((featured) => featured.versions)
      .flatten()
      .value()
  );

  const baseFeaturedList = _.chain(getRundowns(featuredList))
    .orderBy(getSortFunction(), getOrderByOrders())
    .value();

  const filteredFeaturedList = _.chain(baseFeaturedList)
    .filter(getFilterFunction(filterText))
    .value();

  const rundown = filteredFeaturedList.length
    ? filteredFeaturedList
    : baseFeaturedList;

  return (
    <>
      <Table definition unstackable selectable compact className={"history"}>
        <HistoryHeader
          versionParts={versionParts}
          onChange={handleFilterChange}
        />
        <Table.Body>
          {rundown
            .slice(0, loaded ? rundown.length : InitialNumberOfRows)
            .map((r, rI) => (
              <HistoryRow
                key={rI}
                bannerType={bannerType}
                featuredList={featuredList}
                rundown={
                  loaded
                    ? r
                    : {
                        ...r,
                        counter: r.counter.slice(0, InitialNumberOfColumns),
                      }
                }
                dataset={dataset}
              />
            ))}
        </Table.Body>

        <HistoryFooter versionParts={versionParts} />
      </Table>
    </>
  );
}
