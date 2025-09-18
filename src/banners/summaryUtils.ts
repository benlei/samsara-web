type ByFnResult = number | string

export function chunk<T>(
    list: T[],
    byFn: (el: T) => ByFnResult
): T[][] {
    const result: T[][] = [[]]
    if (list.length === 0) {
        return []
    }

    let lastValue = byFn(list[0])

    for (const s of list) {
        if (lastValue === byFn(s)) {
            result[result.length - 1].push(s)
        } else {
            result.push([s])
            lastValue = byFn(s)
        }
    }

    return result
}