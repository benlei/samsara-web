import {Button, Form, Icon, Popup} from "semantic-ui-react";
import React from "react";

type Properties = {
    addClicked: () => any
    editClicked: () => any
}
export default function AddEditPresetPrompt(
    {
        addClicked,
        editClicked
    }: Properties
) {
    return (
        <Form style={{marginTop: '1em', textAlign: 'center'}}>
            <Form.Group widths='equal'>
                <Form.Button
                    content='New Preset' color={'teal'} icon='add'
                    labelPosition='left'
                    onClick={addClicked}
                />

                <Form.Button
                    content={'Edit'}
                    icon='edit'
                    onClick={editClicked}
                    labelPosition='left'
                />

                <Form.Button
                    content={'Swap'}
                    icon={'exchange'}
                    // onClick={this.props.onStartRotationClicked}
                    labelPosition='left'
                />

                <Form.Field>
                    <Popup on={'click'}
                           trigger={
                               <Button icon labelPosition={'left'}>
                                   <Icon name={'arrows alternate vertical'}/> Set Position
                               </Button>
                           } pinned position={'bottom left'}>
                        <Form>
                            <Form.Field>
                                Hi
                                {/*<NumberRangeInput*/}
                                {/*    min={1}*/}
                                {/*    max={this.props.data.data.length}*/}
                                {/*    defaultValue={this.props.index + 1}*/}
                                {/*    color={'teal'}*/}
                                {/*    icon={'exchange'}*/}
                                {/*    onSubmit={this.props.onMoveClicked}*/}
                                {/*/>*/}
                            </Form.Field>
                        </Form>
                    </Popup>
                </Form.Field>

                <Form.Field>
                    <Popup on={'click'}
                           trigger={
                               <Button color={'red'} icon labelPosition={'left'}
                                   // className={this.props.deletable ? '' : 'hidden'}
                               >
                                   <Icon name={'delete'}/> Delete
                               </Button>
                           } pinned position={'bottom left'}>
                        <Form>
                            <Form.Field>
                                <Form.Button
                                    label={'Are you sure? This change will be irreversible!'}
                                    content={'Yes, Delete # 1'} color={'red'} icon='delete'
                                    labelPosition='left'
                                    // onClick={this.props.onDeleteClicked}
                                />
                            </Form.Field>
                        </Form>
                    </Popup>
                </Form.Field>
            </Form.Group>
        </Form>
    )
}