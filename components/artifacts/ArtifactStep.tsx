import {Container, Step} from "semantic-ui-react";
import React from "react";

type Properties = {}

type States = {}

export default class ArtifactStepComponent extends React.Component<Properties, States> {
    render() {
        return (
            <Container style={{marginTop: '2em'}}>
                <Step.Group widths={3}>
                    <Step>
                        <Step.Content>
                            <Step.Title>Yesterday</Step.Title>
                        </Step.Content>
                    </Step>
                    <Step active>
                        <Step.Content>
                            <Step.Title>Today</Step.Title>
                        </Step.Content>
                    </Step>
                    <Step disabled>
                        <Step.Content>
                            <Step.Title>Tomorrow</Step.Title>
                        </Step.Content>
                    </Step>
                </Step.Group>
            </Container>
        )
    }
}