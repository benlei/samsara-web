import {
  BannerDataset,
  BannerHistoryDataset,
  Featured,
  FeaturedHistory,
} from "@/banners/types";
import _ from "lodash";
import YAML from "yaml";
import fs from "fs";
import path from "path";

function toHistory(featured: Featured[]): FeaturedHistory[] {
  return _.chain(featured)
    .map((f) => _.omit(f, "dates") as FeaturedHistory)
    .value();
}

export default function LoadDataset(): BannerHistoryDataset {
  const dataset = YAML.parse(
    fs.readFileSync(path.resolve("./public/data/banners.yaml"), "utf8")
  ) as BannerDataset;

  return {
    fiveStarCharacters: toHistory(dataset.fiveStarCharacters),
    fiveStarWeapons: toHistory(dataset.fiveStarWeapons),
    fourStarCharacters: toHistory(dataset.fourStarCharacters),
    fourStarWeapons: toHistory(dataset.fourStarWeapons),
  };
}

export function LoadHSRDataset(): BannerHistoryDataset {
  const dataset = YAML.parse(
    fs.readFileSync(path.resolve("./public/data/hsr-banners.yaml"), "utf8")
  ) as BannerDataset;

  return {
    fiveStarCharacters: toHistory(dataset.fiveStarCharacters),
    fiveStarWeapons: toHistory(dataset.fiveStarWeapons),
    fourStarCharacters: toHistory(dataset.fourStarCharacters),
    fourStarWeapons: toHistory(dataset.fourStarWeapons),
  };
}
