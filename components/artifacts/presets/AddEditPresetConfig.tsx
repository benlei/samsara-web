import {Checkbox, Container, Form, Input} from "semantic-ui-react";
import React from "react";
import AddEditPresetSubmit from "@/components/artifacts/presets/AddEditPresetSubmit";
import {RotationPreset, RotationStorage} from "@/artifacts/types";
import _ from "lodash";
import NumberRangeInput from "@/components/NumberRangeInput";

type Properties = {
    cancelClicked: () => any
    isAdd: boolean
    preparedPreset: RotationPreset
    setPreparedPreset: (preset: RotationPreset) => any
}

export default function AddEditPresetConfig(props: Properties) {
    function handleFixedClicked() {
        const newPreset = _.cloneDeep<RotationPreset>(props.preparedPreset)
        newPreset.fixed = !newPreset.fixed
        props.setPreparedPreset(newPreset)
    }

    function handleFixedDaysChanged(num: number) {
        const newPreset = _.cloneDeep<RotationPreset>(props.preparedPreset)
        newPreset.fixedDays = num
        props.setPreparedPreset(newPreset)
    }

    function handleNameChange(event: React.ChangeEvent<HTMLInputElement>) {
        const newPreset = _.cloneDeep<RotationPreset>(props.preparedPreset)
        newPreset.name = event.target.value
        props.setPreparedPreset(newPreset)
    }

    return (
        <Container fluid textAlign={'left'} style={{padding: '1em'}}>
            <Form>
                <Form.Group>
                    <Form.Field width={'six'}>
                        <label>Set Preset Name</label>
                        <Input fluid
                               onChange={handleNameChange}
                               value={props.preparedPreset.name}
                        />
                    </Form.Field>
                </Form.Group>

                <Form.Group style={{marginTop: '1em'}}>
                    <Form.Field width={'four'}>
                        <label>Fixed Rotation Days?</label>
                        <Checkbox checked={props.preparedPreset.fixed} onClick={handleFixedClicked}/>
                    </Form.Field>
                </Form.Group>

                <Form.Group style={{marginTop: '1em'}}>
                    <Form.Field width={'four'}>
                        <label>Number of Rotation Days</label>
                        <NumberRangeInput
                            min={1}
                            max={1000}
                            defaultValue={props.preparedPreset.fixedDays}
                            onChange={handleFixedDaysChanged}
                            placeholder={'Enter # days'}
                            disabled={!props.preparedPreset.fixed}
                        />
                    </Form.Field>
                </Form.Group>

                <AddEditPresetSubmit {...props} />
            </Form>
        </Container>
    )
}