import {Container, Menu} from "semantic-ui-react";
import React from "react";
import {AddEditSharedProperties} from "@/artifacts/types";
import {AddEditPhase} from "@/artifacts/enums";

type Properties = {
    phase: AddEditPhase
} & AddEditSharedProperties

type States = {}

export default class ArtifactConfigLoadDownload extends React.Component<Properties, States> {
    setPhaseHandler = (phase: AddEditPhase) => {
        return () => this.props.setPhase(phase)
    }

    render() {
        return (
            <Container textAlign={'left'} style={{padding: '1em'}}>
                <Menu stackable secondary>
                    <Menu.Item
                        name='Select Domain'
                        active={this.props.phase == AddEditPhase.Domain}
                        onClick={this.setPhaseHandler(AddEditPhase.Domain)}
                    />
                    <Menu.Item
                        name='Select Intended Characters'
                        active={this.props.phase == AddEditPhase.Characters}
                        onClick={this.setPhaseHandler(AddEditPhase.Characters)}
                    />
                    <Menu.Item
                        name='Set Rotation Info'
                        active={this.props.phase == AddEditPhase.Info}
                        onClick={this.setPhaseHandler(AddEditPhase.Info)}
                    />
                </Menu>
            </Container>
        )
    }
}