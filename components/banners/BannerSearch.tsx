import _ from "lodash";
import {Icon, Input, InputOnChangeData} from "semantic-ui-react";
import React, {ChangeEvent, useEffect, useState} from "react";

type Properties = {
    onChange: (event: ChangeEvent<HTMLInputElement>, data: InputOnChangeData) => any
}
export default function BannerSearch(
    {
        onChange,
    }: Properties
) {
    const [ssr, setSsr] = useState(true)

    useEffect(() => setSsr(false), [])

    if (ssr) {
        return null
    }

    return (
        <Input fluid
               placeholder={'Filter name...'}
               onChange={_.debounce(onChange, 500)}
            // value={filterText}
               style={{minWidth: '16em'}} icon>
            <input/>
            <Icon name='search'/>
        </Input>
    )
}