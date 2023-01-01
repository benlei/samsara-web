import {Button, Container, Form} from "semantic-ui-react";
import React from "react";
import {AddEdit, AddEditSharedProperties} from "@/artifacts/types";
import {AddEditPhase} from "@/artifacts/enums";
import AddEditAddButton from "@/components/artifacts/AddEditAddButton";
import AddEditEditButton from "@/components/artifacts/AddEditEditButton";

type Properties = {} & AddEditSharedProperties

type States = {}

export default class AddEditSubmit extends React.Component<Properties, States> {
    constructor(props: Readonly<Properties> | Properties) {
        super(props);
    }

    setPhaseHandler = (phase: AddEditPhase) => {
        return () => this.props.setPhase(phase)
    }

    render() {
        return (
            <Container textAlign={'left'} style={{padding: '1em'}}>
                <Form style={{marginTop: '2em'}}>
                    <Form.Group widths='equal'>
                        <Form.Field>
                            {this.props.addEdit == AddEdit.Add &&
                                <AddEditAddButton {...this.props} />
                            }
                            {this.props.addEdit == AddEdit.Edit &&
                                <AddEditEditButton {...this.props} />
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