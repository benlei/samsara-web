import AddEditPresetPrompt from "@/components/artifacts/presets/AddEditPresetPrompt";
import {useEffect, useState} from "react";
import {AddEditPresetPhase} from "@/artifacts/enums";
import AddEditPresetConfig from "@/components/artifacts/presets/AddEditPresetConfig";
import {RotationPresets, RotationStorage} from "@/artifacts/types";
import {dateAsString, getBasePreparedReset} from "@/artifacts/presets";
import _ from "lodash";


type Properties = {
    index: number
    storage: RotationStorage | null
}


export function AddEditPreset(
    {
        index,
        storage
    }: Properties
) {
    const [phase, setPhase] = useState(AddEditPresetPhase.Prompt)
    const [isAdd, setIsAdd] = useState(true)
    const [preparedPreset, setPreparedPreset] = useState(getBasePreparedReset('2023-01-01'))

    useEffect(() => {
        setPreparedPreset(
            _.cloneDeep<RotationPresets>(storage?.presets?.[index] ?? getBasePreparedReset('2023-01-01'))
        )
    }, [storage?.presets, index])

    function addClicked() {
        setPhase(AddEditPresetPhase.AddEdit)
        setPreparedPreset(getBasePreparedReset(dateAsString(new Date())))
        setIsAdd(true)
    }

    function editClicked() {
        setPhase(AddEditPresetPhase.AddEdit)
        // setPreparedPreset(preparedPreset)
        setIsAdd(false)
    }

    function cancelClicked() {
        setPhase(AddEditPresetPhase.Prompt)
        setPreparedPreset(
            _.cloneDeep<RotationPresets>(storage?.presets?.[index] ?? getBasePreparedReset(dateAsString(new Date())))
        )
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
                    isAdd={isAdd}
                    cancelClicked={cancelClicked}
                />
            }
        </>
    )
}