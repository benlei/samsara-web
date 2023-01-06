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
    return (
        <>
            <Input fluid
                   placeholder={'Filter name...'}
                   onChange={_.debounce(onChange, 250)}
                   style={{minWidth: '16em'}} icon>
                <input autoComplete={'off'} />
                <Icon name='search'/>
            </Input>
        </>
    )
}