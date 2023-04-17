import _ from "lodash";
import {Icon, Input, InputOnChangeData} from "semantic-ui-react";
import React, {ChangeEvent} from "react";

type Properties = {
    onChange: (event: ChangeEvent<HTMLInputElement>, data: InputOnChangeData) => any
}
export default function HistorySearch(
    {
        onChange,
    }: Properties
) {
    return (
        <>
            <Input fluid
                   placeholder={'Filter name...'}
                   onChange={_.debounce(onChange, 250)}
                   className={'desktop'}
                   style={{minWidth: '16em'}} icon data-html2canvas-ignore>
                <input autoComplete={'off'}/>
                <Icon name='search'/>
            </Input>
        </>
    )
}