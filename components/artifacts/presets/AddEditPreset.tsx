import AddEditPresetPrompt from "@/components/artifacts/presets/AddEditPresetPrompt";
import {useState} from "react";
import {AddEditPresetPhase} from "@/artifacts/enums";
import AddEditPresetConfig from "@/components/artifacts/presets/AddEditPresetConfig";
import {RotationStorage} from "@/artifacts/types";

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
                    storage={storage}
                    index={index}
                    isAdd={isAdd}
                    cancelClicked={cancelClicked}
                />
            }
        </>
    )
}