import React, {ChangeEvent} from "react";
import {Icon, Input, InputOnChangeData, Table} from "semantic-ui-react";
import {VersionParts} from "@/banners/types";
import _ from "lodash";
import BannerSearch from "./BannerSearch";


type Properties = {
    bannerType: string
    filterText: string | null
    versionParts: VersionParts[]
    onChange: (event: ChangeEvent<HTMLInputElement>, data: InputOnChangeData) => void
}

type States = {}

export default class BannerHeader extends React.Component<Properties, States> {
    render() {
        const {
            bannerType,
            filterText,
            onChange,
            versionParts,
        } = this.props
        return (
            <Table.Header>
                <Table.Row>
                    <Table.HeaderCell className={'no-border'}
                                      style={{pointerEvents: 'auto', padding: '0 .5em'}}>
                        <BannerSearch onChange={onChange} />
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