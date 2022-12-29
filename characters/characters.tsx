import {Characters} from "@/characters/types";
import {getImageFromName} from "@/format/image";
import _ from "lodash";

export function getCharacters(data: string[]): Characters {
    return _.chain(data)
        .reduce((result: Characters, value) => {
            result[value] = {
                name: value,
                image: getImageFromName(value),
            }

            return result
        }, {})
        .value()
}