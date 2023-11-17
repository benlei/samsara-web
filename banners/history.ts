import {
  BannerDataset,
  BannerHistoryDataset,
  Featured,
  FeaturedHistory,
} from "@/banners/types";
import fs from "fs";
import _ from "lodash";
import path from "path";
import YAML from "yaml";

function toHistory(featured: Featured[]): FeaturedHistory[] {
  return _.chain(featured)
    .map((f) => _.omit(f, "dates") as FeaturedHistory)
    .value();
}

export default function LoadGenshinHistory(): BannerHistoryDataset {
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

export function LoadHSRHistory(): BannerHistoryDataset {
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

export function LoadGenshinBanners(): BannerDataset {
  return YAML.parse(
    fs.readFileSync(path.resolve("./public/data/banners.yaml"), "utf8")
  ) as BannerDataset;
}

export function LoadHSRBanners(): BannerDataset {
  return YAML.parse(
    fs.readFileSync(path.resolve("./public/data/hsr-banners.yaml"), "utf8")
  ) as BannerDataset;
}
