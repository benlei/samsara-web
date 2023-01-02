import {Container, Menu} from "semantic-ui-react";
import React from "react";
import {AddEditSharedProperties} from "@/artifacts/types";
import {AddEditRotationPhase} from "@/artifacts/enums";

type Properties = {
    phase: AddEditRotationPhase
} & AddEditSharedProperties

type States = {}

export default class ArtifactConfigLoadDownload extends React.Component<Properties, States> {
    setPhaseHandler = (phase: AddEditRotationPhase) => {
        return () => this.props.setPhase(phase)
    }

    render() {
        return (
            <Container fluid textAlign={'left'} style={{padding: '1em'}}>
                <Menu stackable secondary>
                    <Menu.Item
                        name='Select Domain'
                        active={this.props.phase == AddEditRotationPhase.Domain}
                        onClick={this.setPhaseHandler(AddEditRotationPhase.Domain)}
                    />
                    <Menu.Item
                        name='Select Intended Characters'
                        active={this.props.phase == AddEditRotationPhase.Characters}
                        onClick={this.setPhaseHandler(AddEditRotationPhase.Characters)}
                    />
                    <Menu.Item
                        name='Set Rotation Info'
                        active={this.props.phase == AddEditRotationPhase.Info}
                        onClick={this.setPhaseHandler(AddEditRotationPhase.Info)}
                    />
                </Menu>
            </Container>
        )
    }
}