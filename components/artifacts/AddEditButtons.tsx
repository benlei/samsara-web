import {Button, Form} from "semantic-ui-react";
import React from "react";
import {AddEdit, AddEditButtonsProperties} from "@/artifacts/types";
import {AddEditPhase} from "@/artifacts/enums";
import AddEditAddButton from "@/components/artifacts/AddEditAddButton";
import AddEditEditButton from "@/components/artifacts/AddEditEditButton";

type Properties = {
    disableDomains: boolean
    disableCharacters: boolean
    disableInfo: boolean
} & AddEditButtonsProperties

type States = {}

export default class AddEditButtons extends React.Component<Properties, States> {
    public static defaultProps = {
        disableDomains: false,
        disableInfo: false,
        disableCharacters: false,
    }

    constructor(props: Readonly<Properties> | Properties) {
        super(props);
    }

    setPhaseHandler = (phase: AddEditPhase) => {
        return () => this.props.setPhase(phase)
    }

    render() {
        return (
            <Form style={{marginTop: '2em', textAlign: 'center'}}>
                <Form.Group widths='equal'>
                    <Form.Field>
                        {this.props.addEdit == AddEdit.Add &&
                            <AddEditAddButton {...this.props} />
                        }
                        {this.props.addEdit == AddEdit.Edit &&
                            <AddEditEditButton {...this.props} />
                        }
                    </Form.Field>
                    <Form.Field>
                        <Button color={this.props.disableDomains ? 'grey' : 'blue'}
                                disabled={this.props.disableDomains}
                                onClick={this.setPhaseHandler(AddEditPhase.Domain)}>
                            Domain
                        </Button>
                    </Form.Field>
                    <Form.Field>
                        <Button color={this.props.disableCharacters ? 'grey' : 'blue'}
                                disabled={this.props.disableCharacters}
                                onClick={this.setPhaseHandler(AddEditPhase.Characters)}>
                            Intended Characters
                        </Button>
                    </Form.Field>
                    <Form.Field>
                        <Button color={this.props.disableInfo ? 'grey' : 'blue'}
                                disabled={this.props.disableInfo}
                                onClick={this.setPhaseHandler(AddEditPhase.Info)}>
                            Info
                        </Button>
                    </Form.Field>
                    <Form.Field>
                        <Button color={'red'} onClick={this.props.onCancel}>
                            Cancel
                        </Button>
                    </Form.Field>
                </Form.Group>
            </Form>
        )
    }
}