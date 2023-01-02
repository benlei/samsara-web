import {Button, Container, Form} from "semantic-ui-react";
import React from "react";
import {AddEdit, AddEditSharedProperties} from "@/artifacts/types";
import {AddEditRotationPhase} from "@/artifacts/enums";
import AddEditRotationAddButton from "@/components/artifacts/rotations/AddEditRotationAddButton";
import AddEditRotationEditButton from "@/components/artifacts/rotations/AddEditRotationEditButton";

type Properties = {} & AddEditSharedProperties

type States = {}

export default class AddEditRotationSubmit extends React.Component<Properties, States> {
    constructor(props: Readonly<Properties> | Properties) {
        super(props);
    }

    setPhaseHandler = (phase: AddEditRotationPhase) => {
        return () => this.props.setPhase(phase)
    }

    render() {
        return (
            <Container fluid textAlign={'left'} style={{padding: '1em'}}>
                <Form style={{marginTop: '2em'}}>
                    <Form.Group widths='equal'>
                        <Form.Field>
                            {this.props.addEdit == AddEdit.Add &&
                                <AddEditRotationAddButton {...this.props} />
                            }
                            {this.props.addEdit == AddEdit.Edit &&
                                <AddEditRotationEditButton {...this.props} />
                            }

                            <Button color={'red'} onClick={this.props.onCancel}>
                                Cancel
                            </Button>
                        </Form.Field>
                    </Form.Group>
                </Form>
            </Container>
        )
    }
}