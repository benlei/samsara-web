import {AverageCountSummary, CountSummary, LeaderboardSummary} from "@/banners/summary";

type Summary = CountSummary | LeaderboardSummary | AverageCountSummary
type ByFnResult = number | string

export function chunk<T extends Summary>(
    summary: T[],
    byFn: (s: T) => ByFnResult
): T[][] {
    const result: T[][] = [[]]
    let lastValue = byFn(summary[0])

    for (const s of summary) {
        if (lastValue === byFn(s)) {
            result[result.length - 1].push(s)
        } else {
            result.push([s])
            lastValue = byFn(s)
        }
    }

    return result
}