import React, {ChangeEvent} from "react";
import {Icon, InputOnChangeData, Table} from "semantic-ui-react";
import {VersionParts} from "@/banners/types";
import BannerSearch from "./BannerSearch";


type Properties = {
    versionParts: VersionParts[]
    onChange: (event: ChangeEvent<HTMLInputElement>, data: InputOnChangeData) => void
}

type States = {}

export default class BannerHeader extends React.Component<Properties, States> {
    render() {
        const {
            onChange,
            versionParts,
        } = this.props
        return (
            <Table.Header>
                <Table.Row>
                    <Table.HeaderCell className={'borderless'}
                                      style={{pointerEvents: 'auto', padding: '0 .5em'}}>
                        <BannerSearch onChange={onChange}/>
                    </Table.HeaderCell>
                    <Table.HeaderCell>
                        <Icon name='redo'/>
                    </Table.HeaderCell>
                    {versionParts.map(function (vp, idx) {
                        return (
                            <Table.HeaderCell colSpan={vp.parts} key={idx}>{vp.version}</Table.HeaderCell>
                        )
                    })}
                </Table.Row>
            </Table.Header>
        )
    }
}