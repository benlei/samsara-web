import { Featured, BannerHistoryDataset } from "@/banners/types";
import React from "react";

export type ValidCombination = {
  star: "4star" | "5star";
  type: "characters" | "hsr-characters" | "weapons" | "lightcones";
};

export const VALID_COMBINATIONS: ValidCombination[] = [
  { star: "4star", type: "characters" },
  { star: "5star", type: "characters" },
  { star: "4star", type: "weapons" },
  { star: "5star", type: "weapons" },
  { star: "4star", type: "hsr-characters" },
  { star: "5star", type: "hsr-characters" },
  { star: "4star", type: "lightcones" },
  { star: "5star", type: "lightcones" },
];

export const getDisplayText = (type: string) => {
  switch (type) {
    case "characters":
      return { itemText: "Character", itemsText: "Characters" };
    case "hsr-characters":
      return { itemText: "HSR Character", itemsText: "HSR Characters" };
    case "weapons":
      return { itemText: "Weapon", itemsText: "Weapons" };
    case "lightcones":
      return { itemText: "Lightcone", itemsText: "Lightcones" };
    default:
      return { itemText: "Item", itemsText: "Items" };
  }
};

export const getPageTitle = (star: string, type: string, page?: string) => {
  const { itemText } = getDisplayText(type);
  const starSymbol = star === "4star" ? "4★" : "5★";
  
  switch (page) {
    case "summary":
      return `${starSymbol} ${itemText} Summary - Samsara`;
    case "summary-avg":
      const avgText = type === "lightcones" ? "Lightcone Average Reruns" : `${itemText} Average Reruns`;
      return `${starSymbol} ${avgText} - Samsara`;
    case "runs":
      return `${starSymbol} ${itemText} Reruns Summary - Samsara`;
    case "longest-leaderboard":
      return `${starSymbol} ${itemText} Longest Rerun Leaderboard - Samsara`;
    case "shortest-leaderboard":
      return `${starSymbol} ${itemText} Shortest Rerun Leaderboard - Samsara`;
    default:
      return `${starSymbol} ${itemText} Banner History - Samsara`;
  }
};

export const getPageHeading = (star: string, type: string, page?: string) => {
  const { itemText } = getDisplayText(type);
  const starSymbol = star === "4star" ? "4★" : "5★";
  
  switch (page) {
    case "summary":
      return `${starSymbol} ${itemText} Summary`;
    case "summary-avg":
      const avgText = type === "lightcones" ? "Lightcone Average Reruns" : `${itemText} Average Reruns`;
      return `${starSymbol} ${avgText}`;
    case "runs":
      return `${starSymbol} ${itemText} Reruns Summary`;
    case "longest-leaderboard":
      return `${starSymbol} Longest Rerun Leaderboard Summary`;
    case "shortest-leaderboard":
      return `${starSymbol} Shortest Rerun Leaderboard Summary`;
    default:
      return `${starSymbol} ${itemText} Banner History`;
  }
};

export const getTypeContext = (type: string) => {
  const isHSR = type === "hsr-characters" || type === "lightcones";
  
  if (isHSR) {
    return {
      charactersText: "Characters",
      characterType: "hsr-characters",
      weaponsText: "Lightcones",
      weaponType: "lightcones",
    };
  }
  
  return {
    charactersText: "Characters",
    characterType: "characters",
    weaponsText: "Weapons", 
    weaponType: "weapons",
  };
};

export const getBannerType = (type: string) => {
  switch (type) {
    case "characters":
      return "characters";
    case "hsr-characters":
      return "hsr-characters";
    case "weapons":
      return "weapons";
    case "lightcones":
      return "lightcones";
    default:
      return type;
  }
};

export const getDataset = (type: string): BannerHistoryDataset => {
  // This function should be called from getStaticProps only
  throw new Error("getDataset should only be used server-side in getStaticProps");
};

export const getBanners = (type: string) => {
  // This function should be called from getStaticProps only  
  throw new Error("getBanners should only be used server-side in getStaticProps");
};

export const getFeaturedList = (star: string, type: string): Featured[] => {
  // This function should be called from getStaticProps only
  throw new Error("getFeaturedList should only be used server-side in getStaticProps");
};

export const isHSRType = (type: string): boolean => {
  return type === "hsr-characters" || type === "lightcones";
};
