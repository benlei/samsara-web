import {Button, Container, Form, Step} from "semantic-ui-react";
import React from "react";

type Properties = {}

type States = {}

export default class ArtifactConfigLoadDownload extends React.Component<Properties, States> {
    render() {
        return (
            <Container text style={{marginTop: '2em'}} textAlign={"center"}>
                <Form>
                    <Form.Group widths={"equal"} inline>
                        <Form.Field>
                            <Button content='Download Settings' icon='download' labelPosition='left'/>
                        </Form.Field>
                        <Form.Field>
                            <Button content='Load Settings' icon='upload' labelPosition='right'/>
                        </Form.Field>
                    </Form.Group>
                </Form>
            </Container>
        )
    }
}