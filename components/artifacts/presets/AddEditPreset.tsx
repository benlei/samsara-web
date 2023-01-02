import AddEditPresetPrompt from "@/components/artifacts/presets/AddEditPresetPrompt";
import {useState} from "react";
import {AddEditPresetPhase} from "@/artifacts/enums";
import AddEditPresetConfig from "@/components/artifacts/presets/AddEditPresetConfig";
import {RotationPresets, RotationStorage} from "@/artifacts/types";
import {getBasePreparedReset} from "@/artifacts/presets";
import _ from "lodash";


type Properties = {
    index: number
    storage: RotationStorage
}


export function AddEditPreset(
    {
        index,
        storage
    }: Properties
) {
    const [phase, setPhase] = useState(AddEditPresetPhase.Prompt)
    const [isAdd, setIsAdd] = useState(true)
    const [preparedPreset, setPreparedPreset] = useState(
        _.cloneDeep<RotationPresets>(storage.presets?.[index] ?? getBasePreparedReset('2023-01-01')),
    )

    function addClicked() {
        setPhase(AddEditPresetPhase.AddEdit)
        setIsAdd(true)
    }

    function editClicked() {
        setPhase(AddEditPresetPhase.AddEdit)
        setIsAdd(false)
    }

    function cancelClicked() {
        setPhase(AddEditPresetPhase.Prompt)
    }

    return (
        <>
            {phase == AddEditPresetPhase.Prompt &&
                <AddEditPresetPrompt
                    index={index}
                    addClicked={addClicked}
                    editClicked={editClicked}
                />
            }

            {phase == AddEditPresetPhase.AddEdit &&
                <AddEditPresetConfig
                    preparedPreset={preparedPreset}
                    setPreparedPreset={setPreparedPreset}
                    storage={storage}
                    index={index}
                    isAdd={isAdd}
                    cancelClicked={cancelClicked}
                />
            }
        </>
    )
}