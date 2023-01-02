import {Button, Form} from "semantic-ui-react";
import React from "react";

type Properties = {
    cancelClicked: () => any
    isAdd: boolean
}

export default function AddEditPresetSubmit(
    {
        cancelClicked,
        isAdd,
    }: Properties
) {
    return (
        <Form.Group widths='equal' style={{marginTop: '1em'}}>
            <Form.Field>
                {/*{this.props.addEdit == AddEdit.Add &&*/}
                {/*    <AddEditRotationAddButton {...this.props} />*/}
                {/*}*/}
                {/*{this.props.addEdit == AddEdit.Edit &&*/}
                {/*    <AddEditRotationEditButton {...this.props} />*/}
                {/*}*/}

                <Button color={'red'} onClick={cancelClicked}>
                    Cancel
                </Button>
            </Form.Field>
        </Form.Group>
    )
}