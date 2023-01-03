import {Button, Form, Icon, Popup} from "semantic-ui-react";
import React from "react";
import {ListManager, RotationPreset, RotationStorage} from "@/artifacts/types";
import NumberRangeInputWithIcon from "@/components/NumberRangeInputWithIcon";

type Properties = {
    addClicked: () => any
    editClicked: () => any
    index: number
    manager: ListManager<RotationPreset>
    setActiveStorage: (index: number) => void
    closeAccordion: () => void
    storage: RotationStorage
}
export default function AddEditPresetPrompt(
    {
        addClicked,
        editClicked,
        index,
        manager,
        setActiveStorage,
        closeAccordion,
        storage,
    }: Properties
) {
    return (
        <Form style={{marginTop: '1em', textAlign: 'center'}}>
            <Form.Group widths='equal'>
                <Form.Button
                    content='New Preset' color={'teal'} icon='add'
                    labelPosition='left'
                    onClick={addClicked}
                />

                <Form.Button
                    content={'Edit'}
                    icon='edit'
                    onClick={editClicked}
                    labelPosition='left'
                    className={index === -1 ? 'hidden' : ''}
                />

                <Form.Button
                    content={'Swap'}
                    icon={'exchange'}
                    color={'blue'}
                    onClick={() => {
                        setActiveStorage(index)
                        closeAccordion()
                    }}
                    labelPosition='left'
                    className={index === -1 ? 'hidden' : ''}
                />

                <Form.Field>
                    <Popup on={'click'}
                           trigger={
                               <Button icon labelPosition={'left'}
                                       className={index === -1 ? 'hidden' : ''}
                               >
                                   <Icon name={'arrows alternate vertical'}/> Set Position
                               </Button>
                           } pinned position={'bottom left'}>
                        <Form>
                            <Form.Field>
                                <NumberRangeInputWithIcon
                                    min={1}
                                    max={storage.presets.length}
                                    defaultValue={index + 1}
                                    color={'teal'}
                                    icon={'exchange'}
                                    onSubmit={(position: number) => manager.move(index, position - 1)}
                                />
                            </Form.Field>
                        </Form>
                    </Popup>
                </Form.Field>

                <Form.Field>
                    <Popup on={'click'}
                           trigger={
                               <Button color={'red'} icon labelPosition={'left'}
                                       className={index === -1 ? 'hidden' : ''}
                               >
                                   <Icon name={'delete'}/> Delete
                               </Button>
                           } pinned position={'bottom left'}>
                        <Form>
                            <Form.Field>
                                <Form.Button
                                    label={'Are you sure? This change will be irreversible!' + (index === storage.active ? ' After deleting this preset, the next immediate first preset will be swapped to, if possible.' : '')}
                                    content={'Yes, Delete #' + (index + 1)} color={'red'} icon='delete'
                                    labelPosition='left'
                                    onClick={() => manager.delete(index)}
                                />
                            </Form.Field>
                        </Form>
                    </Popup>
                </Form.Field>
            </Form.Group>
        </Form>
    )
}