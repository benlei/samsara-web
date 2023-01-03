import {Button, Icon, Popup} from "semantic-ui-react";
import React from "react";
import {ListManager, RotationPreset, RotationStorage} from "@/artifacts/types";

type Properties = {
    index: number
    isAdd: boolean
    preparedPreset: RotationPreset
    manager: ListManager<RotationPreset>
    storage: RotationStorage
    returnToPrompt: () => void
}


export default function AddEditPresetEditButton(props: Properties) {
    function canEdit(): boolean {
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
            {!canEdit() ? (
                <Popup
                    on={'click'}
                    trigger={
                        <Button color={'yellow'} icon
                                labelPosition={'left'}>
                            <Icon name='edit'/> Update
                        </Button>
                    } pinned position={'bottom left'}>
                    {!presetIsNamed() && <p>Please give your preset a name.</p>}
                    {!fixedIsNormal() &&
                        <p>Please provide a valid value between 1 and 1000 for the fixed days.</p>}
                </Popup>
            ) : (
                <Button color={'teal'} icon labelPosition={'left'}
                        onClick={() => {
                            props.manager.set(props.index, props.preparedPreset)
                            props.returnToPrompt()
                        }}>
                    <Icon name={'edit'}/> Update
                </Button>
            )}
        </>
    )
}