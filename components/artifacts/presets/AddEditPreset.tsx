import AddEditPresetPrompt from "@/components/artifacts/presets/AddEditPresetPrompt";
import {useEffect, useState} from "react";
import {AddEditPresetPhase} from "@/artifacts/enums";
import AddEditPresetConfig from "@/components/artifacts/presets/AddEditPresetConfig";
import {ListManager, RotationPreset, RotationStorage} from "@/artifacts/types";
import {dateAsString, getBasePreparedReset} from "@/artifacts/presets";
import _ from "lodash";


type Properties = {
    index: number
    storage: RotationStorage
    manager: ListManager<RotationPreset>
    setActiveStorage: (index: number) => void
    closeAccordion: () => void
}


export function AddEditPreset(
    {
        index,
        storage,
        manager,
        setActiveStorage,
        closeAccordion,
    }: Properties
) {
    const [phase, setPhase] = useState(AddEditPresetPhase.Prompt)
    const [isAdd, setIsAdd] = useState(true)
    const [preparedPreset, setPreparedPreset] = useState(getBasePreparedReset('default', '2023-01-01'))

    useEffect(() => {
        setPreparedPreset(
            _.cloneDeep<RotationPreset>(storage.presets[index])
        )
    }, [storage?.presets, index])

    function addClicked() {
        setPhase(AddEditPresetPhase.AddEdit)
        setPreparedPreset(getBasePreparedReset('', dateAsString(new Date())))
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
            _.cloneDeep<RotationPreset>(storage.presets[index])
        )
    }

    return (
        <>
            {phase == AddEditPresetPhase.Prompt &&
                <AddEditPresetPrompt
                    index={index}
                    addClicked={addClicked}
                    editClicked={editClicked}
                    manager={manager}
                    setActiveStorage={setActiveStorage}
                    closeAccordion={closeAccordion}
                />
            }

            {phase == AddEditPresetPhase.AddEdit &&
                <AddEditPresetConfig
                    index={index}
                    preparedPreset={preparedPreset}
                    setPreparedPreset={setPreparedPreset}
                    storage={storage}
                    isAdd={isAdd}
                    returnToPrompt={() => setPhase(AddEditPresetPhase.Prompt)}
                    cancelClicked={cancelClicked}
                    manager={manager}
                />
            }
        </>
    )
}