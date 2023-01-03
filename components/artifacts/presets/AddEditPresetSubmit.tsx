import {Button, Form} from "semantic-ui-react";
import React from "react";
import AddEditPresetAddButton from "@/components/artifacts/presets/AddEditPresetAddButton";
import AddEditPresetEditButton from "@/components/artifacts/presets/AddEditPresetEditButton";
import {ListManager, RotationPreset, RotationStorage} from "@/artifacts/types";

type Properties = {
    index: number
    cancelClicked: () => any
    isAdd: boolean
    preparedPreset: RotationPreset
    setPreparedPreset: (preset: RotationPreset) => any
    manager: ListManager<RotationPreset>
    storage: RotationStorage
}

export default function AddEditPresetSubmit(props: Properties) {
    return (
        <Form.Group widths='equal' style={{marginTop: '1em'}}>
            <Form.Field>
                {props.isAdd &&
                    <AddEditPresetAddButton {...props}/>
                }
                {!props.isAdd &&
                    <AddEditPresetEditButton/>
                }

                <Button color={'red'} onClick={props.cancelClicked}>
                    Cancel
                </Button>
            </Form.Field>
        </Form.Group>
    )
}