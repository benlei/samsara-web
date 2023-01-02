import {Checkbox, Container, Form, Input} from "semantic-ui-react";
import React from "react";
import AddEditPresetSubmit from "@/components/artifacts/presets/AddEditPresetSubmit";
import {RotationPresets, RotationStorage} from "@/artifacts/types";

type Properties = {
    cancelClicked: () => any
    isAdd: boolean
    index: number
    storage: RotationStorage
    preparedPreset: RotationPresets
    setPreparedPreset: (preset: RotationPresets) => any
}

export default function AddEditPresetConfig(props: Properties) {
    return (
        <Container fluid textAlign={'left'} style={{padding: '1em'}}>
            <Form>
                <Form.Group>
                    <Form.Field width={'six'}>
                        <label>Set Preset Name</label>
                        <Input fluid
                            // onChange={this.onChangeDays}
                               value={props.storage.presets?.[props.index].name}
                        />
                    </Form.Field>
                </Form.Group>

                <Form.Group style={{marginTop: '1em'}}>
                    <Form.Field width={'four'}>
                        <label>Fixed Rotation Days?</label>
                        <Checkbox checked={props.storage.presets?.[props.index].rotations.fixed}/>
                    </Form.Field>
                </Form.Group>

                <Form.Group style={{marginTop: '1em'}}>
                    <Form.Field width={'four'}>
                        <label>Number of Rotation Days</label>
                        <Input fluid
                            // onChange={this.onChangeDays}
                               value={props.storage.presets?.[props.index].rotations.fixedDays}
                        />
                    </Form.Field>
                </Form.Group>

                <AddEditPresetSubmit {...props} />
            </Form>
        </Container>
    )
}