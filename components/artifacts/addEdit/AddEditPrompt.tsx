import React, {Dispatch} from "react";
import {Button, Form, Icon, Popup} from "semantic-ui-react";
import NumberRangeInput from "@/components/NumberRangeInput";
import {Rotations} from "@/artifacts/types";

type Properties = {
    index: number
    data: Rotations
    editable: boolean
    syncable: boolean
    deletable: boolean
    movable: boolean
    onAddClicked: Dispatch<any>
    onEditClicked: Dispatch<any>
    onStartRotationClicked: Dispatch<any>
    onDeleteClicked: Dispatch<any>
    onMoveClicked: (position: number) => void
}

type States = {}

export default class AddEditPrompt extends React.Component<Properties, States> {
    public static defaultProps = {
        onAddClicked: null,
        onEditClicked: null,
        onStartRotationClicked: null,
        onDeleteClicked: null,
    };

    render() {
        return (
            <Form style={{marginTop: '1em'}}>
                <Form.Group widths='equal'>
                    <Form.Button
                        content='New Rotation' color={'green'} icon='add'
                        labelPosition='left' onClick={this.props.onAddClicked}/>
                    <Form.Button
                        content={'Edit #' + (this.props.index + 1)}
                        icon='edit' onClick={this.props.onEditClicked}
                        labelPosition='left'
                        className={this.props.editable ? '' : 'hidden'}/>

                    <Form.Field>
                        <Popup on={'click'}
                               trigger={
                                   <Button icon labelPosition={'left'}
                                           className={this.props.deletable ? '' : 'hidden'}>
                                       <Icon name={'exchange'}/> Change Position of #{this.props.index + 1}
                                   </Button>
                               } pinned position={'bottom left'}>
                            <Form>
                                <Form.Field>
                                    <NumberRangeInput
                                        min={1}
                                        max={this.props.data.data.length}
                                        defaultValue={this.props.index + 1}
                                        color={'green'}
                                        icon={'exchange'}
                                        onSubmit={this.props.onMoveClicked}
                                    />
                                </Form.Field>
                            </Form>
                        </Popup>
                    </Form.Field>

                    <Form.Button
                        content={'Start Rotation at #' + (this.props.index + 1)}
                        icon='pin' onClick={this.props.onStartRotationClicked}
                        labelPosition='left'
                        className={this.props.syncable ? '' : 'hidden'}/>

                    <Form.Field>
                        <Popup on={'click'}
                               trigger={
                                   <Button color={'red'} icon labelPosition={'left'}
                                           className={this.props.deletable ? '' : 'hidden'}>
                                       <Icon name={'delete'}/> Delete #{this.props.index + 1}
                                   </Button>
                               } pinned position={'bottom left'}>
                            <Form>
                                <Form.Field>
                                    <Form.Button
                                        label={'Are you sure? This change will be irreversible!'}
                                        content={'Yes, Delete #' + (this.props.index + 1)} color={'red'} icon='delete'
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