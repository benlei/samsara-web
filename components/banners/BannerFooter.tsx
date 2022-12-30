import React from "react";
import {Icon, Table} from "semantic-ui-react";
import {VersionParts} from "@/banners/types";

type Properties = {
    versionParts: VersionParts[]
}

type States = {}

export default class BannerFooter extends React.Component<Properties, States> {
    render() {
        const {
            versionParts,
        } = this.props

        return (
            <Table.Footer>
                <Table.Row>
                    <Table.HeaderCell className={'no-border'}/>
                    <Table.HeaderCell>
                        <Icon name='redo'/>
                    </Table.HeaderCell>
                    {versionParts.map((vp, idx) => (
                        <Table.HeaderCell colSpan={vp.parts} key={idx}>
                            {vp.version}
                        </Table.HeaderCell>
                    ))}
                </Table.Row>
            </Table.Footer>
        )
    }
}