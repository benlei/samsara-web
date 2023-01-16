import {Characters} from "@/characters/types";
import {getImageFromName} from "@/format/image";
import _ from "lodash";

export function getCharacters(data: string[]): Characters {
    function addOneOffs(result: Characters): Characters {
        result['Traveler'] = {
            name: 'Traveler',
            image: 'Traveler',
        }

        result['Aloy'] = {
            name: 'Aloy',
            image: 'Aloy',
        }
        return result
    }

    return addOneOffs(
        _.chain(data)
            .reduce((result: Characters, value) => {
                result[value] = {
                    name: value,
                    image: getImageFromName(value),
                }

                return result
            }, {})
            .value()
    )
}