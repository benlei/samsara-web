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

export function getDays(preset: RotationPreset, index: number): number {
    if (preset.fixed) {
        return preset.fixedDays
    }

    if (!preset.rotations.length || preset.rotations.length <= index) {
        return DefaultFixedDays
    }

    return preset.rotations[index].days ?? DefaultFixedDays
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