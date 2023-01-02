import {Button, Container, Form} from "semantic-ui-react";
import React from "react";

type Properties = {
    cancelClicked: () => any
    isAdd: boolean
}

export default function AddEditPresetConfig(
    {
        cancelClicked,
        isAdd,
    }: Properties
) {
    return (
        <Container fluid textAlign={'left'} style={{padding: '1em'}}>
            <Form style={{marginTop: '2em'}}>
                <Form.Group widths='equal'>
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
            </Form>
        </Container>
    )
}