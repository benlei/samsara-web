import {Accordion, Container, Icon, Table} from "semantic-ui-react";
import React, {useState} from "react";
import {ListManager, RotationPreset, RotationStorage} from "@/artifacts/types";
import {AddEditPreset} from "@/components/artifacts/presets/AddEditPreset";
import ClonedList from "@/artifacts/list";
import _ from "lodash";

type Property = {
    storage: RotationStorage
    setStorage: (storage: RotationStorage) => any
}

export default function ArtifactRotationPresets(
    {
        storage,
        setStorage,
    }: Property
) {
    const [accordionIndex, setAccordianIndex] = useState(-1)

    const manager: ListManager<RotationPreset> = {
        delete(index: number, newActiveIndex?: number) {
            setStorage({
                active: storage.active === index ? 0 : storage.active,
                presets: ClonedList.remove(storage.presets, index),
            })

            setAccordianIndex(newActiveIndex ?? -1)
        },
        insert(index: number, el: RotationPreset, newActiveIndex?: number) {
            let active = storage.active
            if (storage.presets.length ?? 0 > 0) {
                if (active === index || active > index) {
                    active = index + 1
                }
            }

            setStorage({
                active,
                presets: ClonedList.insert(storage.presets, index, el),
            })

            setAccordianIndex(newActiveIndex ?? index)
        },
        move(oldIndex: number, newIndex: number, newActiveIndex?: number) {
            setStorage({
                active: newIndex,
                presets: ClonedList.move(storage.presets, oldIndex, newIndex),
            })

            setAccordianIndex(newActiveIndex ?? newIndex)
        },
        set(index: number, el: RotationPreset, newActiveIndex?: number) {
            setStorage({
                active: storage.active,
                presets: ClonedList.set(storage.presets, index, el),
            })

            setAccordianIndex(newActiveIndex ?? index)
        }
    }

    function setActiveStorage(index: number) {
        setStorage({
            active: index,
            presets: _.cloneDeep<RotationPreset[]>(storage.presets),
        })
    }

    return (
        <Container style={{marginTop: '2em'}} className={'artifact-rotations'}>
            <Table unstackable>
                <Table.Header>
                    <Table.Row>
                        <Table.HeaderCell style={{width: '3rem'}}>#</Table.HeaderCell>
                        <Table.HeaderCell>Preset Name</Table.HeaderCell>
                        <Table.HeaderCell># Rotations</Table.HeaderCell>
                        <Table.HeaderCell>Fixed</Table.HeaderCell>
                        {/*<Table.HeaderCell>Next Rotation</Table.HeaderCell>*/}
                    </Table.Row>
                </Table.Header>

                <Table.Body>
                    {storage.presets.map((preset, k) =>
                        <>
                            <Table.Row key={k} positive={k === storage.active}>
                                <Table.Cell verticalAlign={'top'}>{k + 1}</Table.Cell>
                                <Table.Cell verticalAlign={'top'}>
                                    {preset.name}

                                    <Accordion>
                                        <Accordion.Title active={accordionIndex === k}
                                                         onClick={
                                                             () => setAccordianIndex(k == accordionIndex ? -1 : k)
                                                         }
                                                         index={k}>
                                            <Icon name='dropdown'/>
                                            {accordionIndex === k ? 'Collapse' : 'Expand'} Options
                                        </Accordion.Title>
                                    </Accordion>
                                </Table.Cell>
                                <Table.Cell verticalAlign={'top'}>
                                    {preset.rotations.length}
                                </Table.Cell>
                                <Table.Cell verticalAlign={'top'}>
                                    {preset.fixed ? (
                                        <>
                                            <div><Icon name={'check'}/></div>
                                            <div>({preset.fixedDays} day{preset.fixedDays !== 1 && 's'})</div>
                                        </>
                                    ) : (
                                        <Icon name={'delete'}/>
                                    )}
                                </Table.Cell>
                            </Table.Row>
                            {accordionIndex === k &&
                                <Table.Row key={k}>
                                    <Table.Cell colSpan={4}>
                                        <AddEditPreset
                                            index={k}
                                            closeAccordion={() => setAccordianIndex(-1)}
                                            storage={storage}
                                            manager={manager}
                                            setActiveStorage={setActiveStorage}
                                        />
                                    </Table.Cell>
                                </Table.Row>
                            }
                        </>
                    )}
                    {!storage.presets.length &&
                        <Table.Row>
                            <Table.Cell colSpan={4}>
                                <AddEditPreset
                                    index={-1}
                                    closeAccordion={() => setAccordianIndex(-1)}
                                    storage={storage}
                                    manager={manager}
                                    setActiveStorage={setActiveStorage}
                                />
                            </Table.Cell>
                        </Table.Row>
                    }
                </Table.Body>
            </Table>
        </Container>
    )
}