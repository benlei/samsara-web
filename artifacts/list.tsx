export default class ClonedList {
    public static insert<Type>(data: Type[], index: number, el: Type): Type[] {
        return [
            ...data.slice(0, index),
            el,
            ...data.slice(index),
        ]
    }

// literally exactly same thing
    public static set<Type>(data: Type[], index: number, el: Type): Type[] {
        return [
            ...data.slice(0, index),
            el,
            ...data.slice(index + 1),
        ]
    }

    public static move<Type>(data: Type[], index: number, newIndex: number): Type[] {
        if (newIndex >= data.length || newIndex < 0 || index == newIndex) {
            return data
        }

        if (index < newIndex) {
            return [
                ...data.slice(0, index),
                ...data.slice(index + 1, newIndex + 1),
                data[index],
                ...data.slice(newIndex + 1),
            ]
        }

        return [
            ...data.slice(0, newIndex),
            data[index],
            ...data.slice(newIndex, index),
            ...data.slice(index + 1),
        ]
    }

    public static remove<Type>(data: Type[], index: number): Type[] {
        return [
            ...data.slice(0, index),
            ...data.slice(index + 1),
        ]
    }
}