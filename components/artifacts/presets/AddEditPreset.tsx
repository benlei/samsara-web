import AddEditPresetPrompt from "@/components/artifacts/presets/AddEditPresetPrompt";
import {useState} from "react";
import {AddEditPresetPhase} from "@/artifacts/enums";
import AddEditPresetConfig from "@/components/artifacts/presets/AddEditPresetConfig";

type Properties = {
    index: number
}

export function AddEditPreset(
    {
        index
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
                    addClicked={addClicked}
                    editClicked={editClicked}
                />
            }

            {phase == AddEditPresetPhase.AddEdit &&
                <AddEditPresetConfig
                    isAdd={isAdd}
                    cancelClicked={cancelClicked}
                />
            }
        </>
    )
}