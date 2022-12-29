import {Button, Container, Form, Step} from "semantic-ui-react";
import React from "react";

type Properties = {}

type States = {}

export default class ArtifactConfigLoadDownloadComponent extends React.Component<Properties, States> {
    render() {
        return (
            <Container text style={{marginTop: '2em'}} textAlign={"center"}>
                <Form>
                    <Form.Group widths={"equal"}>
                        <Form.Field>
                            <Button content='Download Settings (JSON)' icon='download' labelPosition='left'/>
                        </Form.Field>
                        <Form.Field>
                            <Button content='Load Settings (JSON)' icon='upload' labelPosition='right'/>
                        </Form.Field>
                    </Form.Group>
                </Form>
            </Container>
        )
    }
}