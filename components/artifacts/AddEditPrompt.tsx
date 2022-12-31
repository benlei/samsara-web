import React, {Dispatch} from "react";
import {Form} from "semantic-ui-react";

type Properties = {
    editable: boolean
    index: number
    syncable: boolean
    deletable: boolean
    onAddClicked: Dispatch<any>
    onEditClicked: Dispatch<any>
    onStartRotationClicked: Dispatch<any>
    onDeleteClicked: Dispatch<any>
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
                        content={'Edit #' + (this.props.index+1)}
                        icon='edit' onClick={this.props.onEditClicked}
                        labelPosition='left'
                        className={this.props.editable ? '': 'hidden'}
                    />

                    <Form.Button
                        content={'Start Rotation at #' + (this.props.index+1)}
                        icon='pin' onClick={this.props.onStartRotationClicked}
                        labelPosition='left'
                        className={this.props.syncable ? '': 'hidden'}
                    />

                    <Form.Button
                        content={'Delete #' + (this.props.index+1)} color={'red'} icon='delete'
                        labelPosition='left' onClick={this.props.onDeleteClicked}
                        className={this.props.deletable ? '': 'hidden'}
                    />
                </Form.Group>
            </Form>
        )
    }
}