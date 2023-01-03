import React, {Dispatch} from "react";
import {Button, Form, Icon, Popup} from "semantic-ui-react";
import NumberRangeInputWithIcon from "@/components/NumberRangeInputWithIcon";
import {RotationPreset} from "@/artifacts/types";

type Properties = {
    index: number
    preset: RotationPreset
    onAddClicked: Dispatch<any>
    onEditClicked: Dispatch<any>
    onStartRotationClicked: Dispatch<any>
    onDeleteClicked: Dispatch<any>
    onMoveClicked: (position: number) => void
}

type States = {}

export default class AddEditRotationPrompt extends React.Component<Properties, States> {
    public static defaultProps = {
        onAddClicked: null,
        onEditClicked: null,
        onStartRotationClicked: null,
        onDeleteClicked: null,
    };

    render() {
        return (
            <Form style={{marginTop: '1em', textAlign: 'center'}}>
                <Form.Group widths='equal'>
                    <Form.Button
                        content='New Rotation' color={'teal'} icon='add'
                        labelPosition='left' onClick={this.props.onAddClicked}/>

                    <Form.Button
                        content={'Edit'}
                        icon='edit' onClick={this.props.onEditClicked}
                        labelPosition='left'
                        className={this.props.index == -1 ? 'hidden' : ''}/>

                    <Form.Button
                        content={'Start Here'}
                        icon='pin' onClick={this.props.onStartRotationClicked}
                        labelPosition='left'
                        className={this.props.index == -1 ? 'hidden' : ''}/>

                    <Form.Field>
                        <Popup on={'click'}
                               trigger={
                                   <Button icon labelPosition={'left'}
                                           className={this.props.index == -1 ? 'hidden' : ''}>
                                       <Icon name={'arrows alternate vertical'}/> Set Position
                                   </Button>
                               } pinned position={'bottom left'}>
                            <Form>
                                <Form.Field>
                                    <NumberRangeInputWithIcon
                                        min={1}
                                        max={this.props.preset.rotations.length}
                                        defaultValue={this.props.index + 1}
                                        color={'teal'}
                                        icon={'exchange'}
                                        onSubmit={this.props.onMoveClicked}
                                    />
                                </Form.Field>
                            </Form>
                        </Popup>
                    </Form.Field>

                    <Form.Field>
                        <Popup on={'click'}
                               trigger={
                                   <Button color={'red'} icon labelPosition={'left'}
                                           className={this.props.index == -1 ? 'hidden' : ''}>
                                       <Icon name={'delete'}/> Delete
                                   </Button>
                               } pinned position={'bottom left'}>
                            <Form>
                                <Form.Field>
                                    <Form.Button
                                        label={'Are you sure? This change will be irreversible!'}
                                        content={'Yes, Delete #' + (this.props.index + 1)} color={'red'}
                                        icon='delete'
                                        labelPosition='left' onClick={this.props.onDeleteClicked}/>
                                </Form.Field>
                            </Form>
                        </Popup>
                    </Form.Field>
                </Form.Group>
            </Form>
        )
    }
}