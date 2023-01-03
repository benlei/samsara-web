import {RotationPreset} from "@/artifacts/types";

export const V1StorageKey = "v1_artifact_rotation"

export const DefaultIsFixed = true
export const DefaultFixedDays = 7

const DayMillisec = 24 * 60 * 60 * 1000

export function dateAsString(date: Date): string {
    return date.getFullYear()
        + '/' + String(date.getMonth() < 9 ? `0${date.getMonth() + 1}` : date.getMonth() + 1)
        + '/' + String(date.getDate() < 10 ? `0${date.getDate()}` : date.getDate())
}

export function dateStringAsDate(dateStr: string): Date {
    return new Date(dateStr)
}

export function getBasePreparedReset(name: string, date: string): RotationPreset {
    return {
        fixed: DefaultIsFixed,
        fixedDays: DefaultFixedDays,
        rotations: [],
        name,
        date,
    }
}

function getDays(preset: RotationPreset, index: number): number {
    if (preset.fixed) {
        return preset.fixedDays
    }

    return preset.rotations[index].days ?? 1
}

export function getRotationIndexAndDay(preset: RotationPreset, endDate: Date): { index: number, day: number } {
    const startDate = new Date(preset.date)
    const currDate = new Date(dateAsString(endDate))

    let totalDays = Math.floor((currDate.getTime() - startDate.getTime()) / DayMillisec)

    let rotationDays = 0
    for (let i = 0; i < preset.rotations.length; i++) {
        rotationDays += getDays(preset, i)
    }

    totalDays %= rotationDays

    let index = 0
    while (totalDays >= getDays(preset, index)) {
        totalDays -= getDays(preset, index)
        index++
    }

    return {
        index,
        day: totalDays + 1,
    }
}

export function calculateDateForRotation(
    preset: RotationPreset,
    index: number,
    day: number,
    currDate: Date,
): string {
    let rotationDays = 0
    for (let i = 0; i < index; i++) {
        rotationDays += getDays(preset, i)
    }

    rotationDays += day - 1

    return dateAsString(new Date(currDate.getTime() - (rotationDays * DayMillisec)))
}

/**
 * General mentality is that any changes should technically keep you in same domain for the day.
 *
 * Example Scenarios:
 * 0. Base scenario: On first rotation added, start it at day 1 of 3.
 * 1. Fixed rotation of 3 days -> 2 days
 *    - Are on Index 50, Day 3. After changing, will be on Index 50, Day 2 (finish off last day)
 *    - Are on Index 50, Day <= 2. After changing, will still be on Index 50, Day <= 2.
 * 2. Fixed rotation of 3 days -> 4 days
 *    - Are on Index 50, Day <= 3. After changing, will be on Index 50, Day 3 (gains an extra day on rotation).
 * 3. Fixed rotation of 3 days -> Flex
 *    - Force set all rotations to 3 days, nothing fundamentally changes.
 * 4. Flex rotation of Index 50. Update its rotation days from 3 to 1
 *    - Are on Index 30, day n of m. After changing, "nothing changes" (still on Index 30 day n of m)
 *    - Are on Index 50, day > 1. After changing, will be on Index 50, day 1 (finish off last day)
 *    - Are on Index 70, day n of m. After changing, "nothing changes" (should still on Index 70 day n of m)
 * 5. Flex rotation of Index 50. Update its rotation days from 3 to 5.
 *    - Are on Index 30, day n of m. After changing, "nothing changes" (still on Index 30 day n of m)
 *    - Are on Index 50, day <= 3. After changing, will be on Index 50, day <= 3 (gains 2 additional days on rotation)
 *    - Are on Index 70, day n of m. After changing, "nothing changes" (should still on Index 70 day n of m)
 * 6. Delete index 50.
 *    - Are on Index 30, day n of m. After deletion, "nothing changes"
 *    - Are on index 50. After deletion, set the new index 50 as start date (day 1 of m).
 *      - if there is no index 50, then loop back to index 0 (day 1 of m).
 *    - Are on Index 80, day n of m. After deletion, "nothing changes" (should still be on index 80 day n of m)
 * 7. Move index 50 to index 30
 *    - Are on index 29, day n of m. After deletion, "nothing changes"
 *    - Was on index 30 to 49 (now 31 to 50), day n of m. After moving, new index for today is just +1 from before, still day n of m
 *    - Was on index 51+, day n of m. After moving, "nothing changes" (still same index, say day n of m)
 *    - Was on index 50 (now 30), day n of m. After moving, set the new index to 30 and should still be day n of m
 * 8. Move index 50 to index 80
 *    - Are on index 0 to 59, day n of m. After moving, "nothing changes"
 *    - Was on index 51 to 80 (now 50 to 79), day n of m. After moving, new index for today is just -1 from before, still day n of m
 *    - Was on index 80+ (now 81+), day n of m. "nothing changes"
 *    - Was on index 50, now index 80 day n of m. After moving, new index for today is 80 and should sitll be day n of m.
 * 9. Add a new rotation to index 30
 *    - Are on index 0 to 29. Nothing changes
 *    - Was on 30+ (now 31+). Should still be on same domain, just index +1.
 */