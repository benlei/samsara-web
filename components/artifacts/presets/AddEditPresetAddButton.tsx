import React from "react";
import {ListManager, RotationPreset, RotationStorage} from "@/artifacts/types";
import {Button, Form, Icon, Popup} from "semantic-ui-react";
import NumberRangeInputWithIcon from "@/components/NumberRangeInputWithIcon";

type Properties = {
    index: number
    isAdd: boolean
    preparedPreset: RotationPreset
    manager: ListManager<RotationPreset>
    storage: RotationStorage
}

export default function AddEditPresetAddButton(props: Properties) {
    function canAdd(): boolean {
        return presetIsNamed() && fixedIsNormal()
    }

    function presetIsNamed(): boolean {
        return props.preparedPreset.name.trim().length > 0
    }

    function fixedIsNormal(): boolean {
        return (
            props.preparedPreset.fixed && props.preparedPreset.fixedDays > 0 && props.preparedPreset.fixedDays <= 1000
        ) || !props.preparedPreset.fixed
    }

    return (
        <>
            {!!props.storage.presets.length ? (
                <Popup
                    on={'click'}
                    trigger={
                        <Button color={canAdd() ? 'teal' : 'yellow'} icon
                                labelPosition={'left'}
                        >
                            <Icon name='caret down'/> Create
                        </Button>
                    }
                    pinned
                    position={'bottom left'}>
                    {!canAdd() ? (
                        <>
                            {!presetIsNamed() && <p>Please give your preset a name.</p>}
                            {!fixedIsNormal() &&
                                <p>Please provide a valid value between 1 and 1000 for the fixed days.</p>}
                        </>

                    ) : (
                        <Form>
                            <Form.Group>
                                <Form.Field>
                                    <Button color={'teal'} icon labelPosition={'right'}
                                            onClick={() => props.manager.insert(props.index + 1, props.preparedPreset)}>
                                        Insert as #{props.index + 2}
                                        <Icon name='add'/>
                                    </Button>
                                </Form.Field>
                            </Form.Group>
                            <Form.Group style={{marginTop: '1rem'}}>
                                <Form.Field>
                                    <label>-or- Insert to Specific Position</label>
                                    <NumberRangeInputWithIcon
                                        min={1}
                                        max={props.storage.presets.length + 1}
                                        defaultValue={props.index + 2}
                                        color={'teal'}
                                        icon={'add'}
                                        onSubmit={(position: number) => props.manager.insert(position, props.preparedPreset)}
                                        placeholder={'Enter # Position'}
                                    />
                                </Form.Field>
                            </Form.Group>
                        </Form>
                    )}
                </Popup>
            ) : (
                <>
                    {!canAdd() ? (
                        <Popup
                            on={'click'}
                            trigger={
                                <Button color={canAdd() ? 'teal' : 'yellow'} icon
                                        labelPosition={'left'}>
                                    <Icon name='add'/> Create #1
                                </Button>
                            } pinned position={'bottom left'}>

                            {!presetIsNamed() && <p>Please give your preset a name.</p>}
                            {!fixedIsNormal() &&
                                <p>Please provide a valid value between 1 and 1000 for the fixed days.</p>}
                        </Popup>
                    ) : (
                        <Button color={'teal'} icon labelPosition={'left'}
                                onClick={() => props.manager.insert(0, props.preparedPreset)}>
                            <Icon name={'add'}/> Create #1
                        </Button>
                    )}
                </>
            )}
        </>
    )
}