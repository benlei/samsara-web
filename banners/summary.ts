import { getBaseVersion, getVersionPart } from "@/banners/version";
import _ from "lodash";
import dayjs, { Dayjs } from "dayjs";
import {
  Featured,
  FeaturedDates,
  FeaturedVersions,
  VersionParts,
} from "@/banners/types";
import { getImageFromName } from "@/format/image";
import utc from "dayjs/plugin/utc";

export const UnknownFutureCounter = -999999999;
const DefaultBannerDayDuration = 21;
const Dark9Percent = 85;
const Dark8Percent = 70;
const Dark7Percent = 55;
const Dark6Percent = 40;
const Dark5Percent = 25;

export type CountSummary = {
  name: string;
  image: string;
  count: number;
};

export type LeaderboardSummary = {
  name: string;
  image: string;
  days: number;
  banners: number;
  patches: number;
};

export type AverageCountSummary = {
  name: string;
  image: string;
  average: number;
  standardDeviation: number;
  count: number;
  discrepancy: boolean;
};

export type DayjsRange = {
  start: Dayjs;
  end: Dayjs;
};

function getNormalizedDayjsBannerDates(
  currDayjs: Dayjs,
  featured: FeaturedDates
): DayjsRange[] {
  function getEquivalentFutureDateFromCurrToRangeStart(
    range: DayjsRange
  ): DayjsRange {
    return {
      start: range.end.subtract(range.start.diff(currDayjs, "day"), "day"),
      end: currDayjs,
    };
  }

  const result: DayjsRange[] = _.chain(featured.dates)
    .filter((dateRange) => dateRange.start != "")
    .map((dateRange) => {
      if (!dateRange.end) {
        return {
          start: dayjs.utc(dateRange.start),
          end: dayjs.utc(dateRange.start).add(DefaultBannerDayDuration, "day"),
        };
      }

      return {
        start: dayjs.utc(dateRange.start),
        end: dayjs.utc(dateRange.end),
      };
    })
    .value();

  if (!result.length) {
    return [];
  }

  if (result[result.length - 1].start.isAfter(currDayjs)) {
    result.push(
      getEquivalentFutureDateFromCurrToRangeStart(result[result.length - 1])
    );
  } else if (currDayjs.isAfter(result[result.length - 1].end)) {
    result.push({
      start: currDayjs,
      end: currDayjs,
    });
  } else {
    result.push({
      start: result[result.length - 1].end,
      end: result[result.length - 1].end,
    });
  }

  return result;
}

function getNormalizedBannerDateGaps(
  currDayjs: Dayjs,
  featured: FeaturedDates
): number[] {
  const dateRanges = getNormalizedDayjsBannerDates(currDayjs, featured);

  const result = [];
  for (let i = 0; i < dateRanges.length - 1; i++) {
    result.push(dateRanges[i + 1].start.diff(dateRanges[i].end, "day"));
  }

  return result;
}

export function getPatchGap(
  versionParts: VersionParts[],
  oldVersion: string,
  newVersion: string
): number {
  const baseOldVersion = getBaseVersion(oldVersion);
  const baseNewVersion = getBaseVersion(newVersion);

  return (
    _.findIndex(versionParts, (vp) => vp.version === baseNewVersion) -
    _.findIndex(versionParts, (vp) => vp.version === baseOldVersion)
  );
}

export function getBannerGap(
  versionParts: VersionParts[],
  oldVersion: string,
  newVersion: string
): number {
  const baseOldVersion = getBaseVersion(oldVersion);
  const baseOldVersionPart = getVersionPart(oldVersion);
  const baseNewVersion = getBaseVersion(newVersion);
  const baseNewVersionPart = getVersionPart(newVersion);

  if (baseOldVersion == baseNewVersion) {
    return baseNewVersionPart - baseOldVersionPart - 1;
  }

  let startIndex = _.findIndex(
    versionParts,
    (vp) => vp.version === baseOldVersion
  );
  const endIndex = _.findIndex(
    versionParts,
    (vp) => vp.version === baseNewVersion
  );

  let total = versionParts[startIndex].parts - baseOldVersionPart;
  while (++startIndex < endIndex) {
    total += versionParts[startIndex].parts;
  }

  total += baseNewVersionPart - 1;

  return total;
}

export function getColorClassName(p: number): string {
  if (p >= Dark9Percent) {
    return "dark-9";
  } else if (p >= Dark8Percent) {
    return "dark-8";
  } else if (p >= Dark7Percent) {
    return "dark-7";
  } else if (p >= Dark6Percent) {
    return "dark-6";
  } else if (p >= Dark5Percent) {
    return "dark-5";
  }
  return "dark-4";
}

export function getPercent(nom: number, denom: number): number {
  if (nom < 0) {
    return 0;
  }

  return Math.max(0.5, (100 * Math.max(0, nom)) / Math.max(1, denom));
}

export function getFilterFunction(
  filterText: string
): (s: { name: string; versions: string[] }) => boolean {
  if (!filterText.trim().length) {
    return () => true;
  }

  function versionCheck(
    filterVersion: string,
    s: { name: string; versions: string[] }
  ): boolean {
    const trimmedFilter = filterVersion.trim();
    
    // Handle Luna versions specially
    if (trimmedFilter.toLowerCase().startsWith('luna')) {
      return _.chain(s.versions)
        .map((v) => v.toLowerCase().startsWith('luna'))
        .includes(true)
        .value();
    }
    
    // Handle numeric versions
    if (!trimmedFilter.match(/^[0-9.]+$/)) {
      return false;
    }

    function isFullVersion(fv: string): boolean {
      return fv.split(".").length >= 2;
    }

    const version = _.trim(trimmedFilter, ".");
    let prefix: string;
    if (isFullVersion(version)) {
      prefix = version;
    } else {
      prefix = version + ".";
    }

    return _.chain(s.versions)
      .map((v) => v.startsWith(prefix))
      .includes(true)
      .value();
  }

  const contains = _.chain(filterText.split(","))
    .map((t) => t.trim())
    .map((t) => t.toLowerCase())
    .filter((t) => t.length > 0)
    .value();

  return (s) =>
    _.chain(contains)
      .map((c) => s.name.toLowerCase().indexOf(c) !== -1 || versionCheck(c, s))
      .includes(true)
      .value();
}

function getCountSummary(
  versionParts: VersionParts[],
  featuredList: Featured[],
  calculate: (featured: Featured) => number
): CountSummary[] {
  return _.map(featuredList, (featured: Featured) => {
    return {
      name: featured.name,
      image: getImageFromName(featured.name),
      count: calculate(featured),
    };
  });
}

export function getDaysSinceRunCountSummary(
  versionParts: VersionParts[],
  featuredList: Featured[],
  currDate: string
): CountSummary[] {
  dayjs.extend(utc);

  const currDayjs = dayjs.utc(currDate);
  return getCountSummary(versionParts, featuredList, (featured) => {
    if (
      featured.dates.length &&
      featured.dates[featured.dates.length - 1].start === ""
    ) {
      return UnknownFutureCounter;
    }

    return _.last(getNormalizedBannerDateGaps(currDayjs, featured)) as number;
  });
}

export function getCurrentVersionPart(
  versionParts: VersionParts[],
  featuredList: Featured[],
  currDajs: Dayjs
): VersionParts {
  let end = versionParts.length - 1;
  let result: VersionParts;
  let latest: Featured;

  do {
    result = { ...versionParts[end] };
    latest = _.chain(featuredList)
      .filter(
        (featured) =>
          getBaseVersion(_.last(featured.versions) as string) == result.version
      )
      .filter(
        (featured) => featured.dates[featured.dates.length - 1].start != ""
      )
      .filter(
        (featured) =>
          currDajs.diff(
            dayjs.utc(featured.dates[featured.dates.length - 1].start, "day")
          ) >= 0
      )
      .orderBy(
        (featured) => featured.dates[featured.dates.length - 1].start,
        "desc"
      )
      .first()
      .value();
    --end;
  } while (latest === undefined);

  result.parts = getVersionPart(latest.versions[latest.versions.length - 1]);

  return result;
}

function isFutureNewRelease(
  currentVersion: VersionParts,
  featured: FeaturedVersions
): boolean {
  return (
    featured.versions.length === 1 &&
    (currentVersion.version < getBaseVersion(featured.versions[0]) ||
      (currentVersion.version == getBaseVersion(featured.versions[0]) &&
        currentVersion.parts < getVersionPart(featured.versions[0])))
  );
}

// for our intents and purposes, we really just need to look at either the last or 2nd last element
function getLastVersion(featured: FeaturedVersions): string {
  return featured.versions[featured.versions.length - 1];
}

export function getBannersSinceLastCountSummary(
  versionParts: VersionParts[],
  featuredList: Featured[],
  currDate: string
): CountSummary[] {
  dayjs.extend(utc);

  const currentVersion = getCurrentVersionPart(
    versionParts,
    featuredList,
    dayjs.utc(currDate)
  );

  return getCountSummary(versionParts, featuredList, (featured) => {
    if (isFutureNewRelease(currentVersion, featured)) {
      return -(
        getBannerGap(
          versionParts,
          `${currentVersion.version}.${currentVersion.parts}`,
          featured.versions[0]
        ) + 1
      );
    }

    return (
      getBannerGap(
        versionParts,
        getLastVersion(featured),
        `${currentVersion.version}.${currentVersion.parts}`
      ) + 1
    );
  });
}

export function getPatchesSinceLastCountSummary(
  versionParts: VersionParts[],
  featuredList: Featured[],
  currDate: string
): CountSummary[] {
  dayjs.extend(utc);

  // for now, can say 'today' is current (doesn't affect existing tests yet)
  const currentVersion = getCurrentVersionPart(
    versionParts,
    featuredList,
    dayjs.utc(currDate)
  );

  return getCountSummary(versionParts, featuredList, (featured) => {
    if (isFutureNewRelease(currentVersion, featured)) {
      return -getPatchGap(
        versionParts,
        `${currentVersion.version}.${currentVersion.parts}`,
        featured.versions[0]
      );
    }

    return getPatchGap(
      versionParts,
      getLastVersion(featured),
      `${currentVersion.version}.${currentVersion.parts}`
    );
  });
}

export function getRunsCountSummary(
  versionParts: VersionParts[],
  featuredList: Featured[]
): CountSummary[] {
  return getCountSummary(
    versionParts,
    featuredList,
    (featured) => featured.versions.length
  );
}

function getAverageCountSummary(
  versionParts: VersionParts[],
  featuredList: Featured[],
  calculateAll: (versionParts: VersionParts[], featured: Featured) => number[]
): AverageCountSummary[] {
  const result: AverageCountSummary[] = [];

  _.forEach(featuredList, (featured) => {
    const counters = calculateAll(versionParts, featured);
    const average = counters.length ? _.sum(counters) / counters.length : 0;
    const standardDeviation = counters.length
      ? Math.sqrt(
          _.sumBy(counters, (c) => Math.pow(c - average, 2)) / counters.length
        )
      : 0;

    result.push({
      name: featured.name,
      image: getImageFromName(featured.name),
      count: counters.length + 1,
      average: _.round(average, 1),
      standardDeviation: _.round(standardDeviation, 1),
      discrepancy: counters.length + 1 != featured.versions.length,
    });
  });

  return result;
}

function getDayGaps(ignore: any, featured: FeaturedDates): number[] {
  const result = [];
  for (let i = 0; i < featured.dates.length - 1; i++) {
    if (featured.dates[i].end == "" || featured.dates[i + 1].start == "") {
      continue;
    }
    result.push(
      dayjs
        .utc(featured.dates[i + 1].start)
        .diff(dayjs.utc(featured.dates[i].end), "day")
    );
  }

  return result;
}

export function getAverageDaysInBetween(
  versionParts: VersionParts[],
  featuredList: Featured[]
): AverageCountSummary[] {
  dayjs.extend(utc);

  return getAverageCountSummary(versionParts, featuredList, getDayGaps);
}

function getBannerGaps(
  versionParts: VersionParts[],
  featured: FeaturedVersions
): number[] {
  const result = [];
  for (let i = 0; i < featured.versions.length - 1; i++) {
    result.push(
      getBannerGap(versionParts, featured.versions[i], featured.versions[i + 1])
    );
  }

  return result;
}

export function getAverageBannersInBetween(
  versionParts: VersionParts[],
  featuredList: Featured[]
): AverageCountSummary[] {
  return getAverageCountSummary(versionParts, featuredList, getBannerGaps);
}

function getPatchGaps(
  versionParts: VersionParts[],
  featured: FeaturedVersions
): number[] {
  const result = [];
  for (let i = 0; i < featured.versions.length - 1; i++) {
    result.push(
      getPatchGap(versionParts, featured.versions[i], featured.versions[i + 1])
    );
  }

  return result;
}

export function getAveragePatchesInBetween(
  versionParts: VersionParts[],
  featuredList: Featured[]
): AverageCountSummary[] {
  return getAverageCountSummary(versionParts, featuredList, getPatchGaps);
}

export function getLongestStatsInBetween(
  versionParts: VersionParts[],
  featuredList: Featured[],
  currDate: string
): LeaderboardSummary[] {
  dayjs.extend(utc);
  const currDayjs = dayjs.utc(currDate);

  function computeDays(featured: Featured): number {
    return Math.max(...getNormalizedBannerDateGaps(currDayjs, featured), 0);
  }

  function computeBanners(featured: Featured): number {
    const ongoingBanner = {
      versions: isLastVersionLatestBanner(versionParts, featured)
        ? featured.versions
        : [
            ...featured.versions,
            versionParts[versionParts.length - 1].version +
              "." +
              (versionParts[versionParts.length - 1].parts + 1),
          ],
    };
    return Math.max(...getBannerGaps(versionParts, ongoingBanner), 0);
  }

  function computePatches(featured: Featured): number {
    const ongoingBanner = {
      versions: isLastVersionLatest(versionParts, featured)
        ? featured.versions
        : [
            ...featured.versions,
            versionParts[versionParts.length - 1].version +
              "." +
              versionParts[versionParts.length - 1].parts,
          ],
    };

    if (isLastVersionLatest(versionParts, featured)) {
      return Math.max(...getPatchGaps(versionParts, ongoingBanner), 0);
    }

    const gaps = getPatchGaps(versionParts, ongoingBanner);
    gaps[gaps.length - 1]++;
    return Math.max(...gaps, 0);
  }

  return _.map(featuredList, (featured: Featured): LeaderboardSummary => {
    return {
      name: featured.name,
      image: getImageFromName(featured.name),
      days: computeDays(featured),
      banners: computeBanners(featured),
      patches: computePatches(featured),
    };
  });
}

export function getShortestStatsInBetween(
  versionParts: VersionParts[],
  featuredList: Featured[],
  currDate: string
): LeaderboardSummary[] {
  dayjs.extend(utc);
  const currDayjs = dayjs.utc(currDate);

  function computeDays(featured: Featured): number {
    const existingDayGaps = getDayGaps(null, featured);
    const ongoingDayGaps = getNormalizedBannerDateGaps(currDayjs, featured);

    if (!existingDayGaps.length) {
      return Math.max(0, Math.min(...ongoingDayGaps));
    }

    return Math.max(Math.min(...existingDayGaps), Math.min(...ongoingDayGaps));
  }

  function computeBanners(featured: Featured): number {
    const ongoingBanner = {
      dates: featured.dates,
      versions: isLastVersionLatestBanner(versionParts, featured)
        ? featured.versions
        : [
            ...featured.versions,
            versionParts[versionParts.length - 1].version +
              "." +
              (versionParts[versionParts.length - 1].parts + 1),
          ],
    };

    return Math.max(
      Math.min(...getBannerGaps(versionParts, featured)),
      Math.min(...getBannerGaps(versionParts, ongoingBanner))
    );
  }

  function computePatches(featured: Featured): number {
    const ongoingBanner = {
      dates: featured.dates,
      versions: isLastVersionLatest(versionParts, featured)
        ? featured.versions
        : [
            ...featured.versions,
            versionParts[versionParts.length - 1].version +
              "." +
              versionParts[versionParts.length - 1].parts,
          ],
    };

    const gaps = getPatchGaps(versionParts, ongoingBanner);
    if (!isLastVersionLatest(versionParts, featured)) {
      gaps[gaps.length - 1]++;
    }

    return Math.max(
      Math.min(...getPatchGaps(versionParts, featured)),
      Math.min(...gaps)
    );
  }

  return _.map(
    _.filter(featuredList, (featured) => featured.versions.length > 1),
    (featured: Featured): LeaderboardSummary => {
      return {
        name: featured.name,
        image: getImageFromName(featured.name),
        days: computeDays(featured),
        banners: computeBanners(featured),
        patches: computePatches(featured),
      };
    }
  );
}

function isLastVersionLatest(
  versionParts: VersionParts[],
  featured: Featured
): boolean {
  return (
    getBaseVersion(featured.versions[featured.versions.length - 1]) ==
    versionParts[versionParts.length - 1].version
  );
}

function isLastVersionLatestBanner(
  versionParts: VersionParts[],
  featured: Featured
): boolean {
  return (
    featured.versions[featured.versions.length - 1] ==
    versionParts[versionParts.length - 1].version +
      "." +
      versionParts[versionParts.length - 1].parts
  );
}
