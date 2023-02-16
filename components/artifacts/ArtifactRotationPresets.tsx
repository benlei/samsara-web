import {Container, Header, Icon, Table} from "semantic-ui-react";
import React, {useState} from "react";
import {ListManager, RotationPreset, RotationStorage} from "@/artifacts/types";
import {AddEditPreset} from "@/components/artifacts/presets/AddEditPreset";
import ClonedList from "@/artifacts/list";
import _ from "lodash";
import {calculateDateForRotation, DefaultFixedDays, getRotationIndexAndDay} from "@/artifacts/presets";

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
    const [selectedIndex, setSelectedIndex] = useState(storage.active)

    const manager: ListManager<RotationPreset> = {
        delete(index: number, newActiveIndex?: number) {
            setStorage({
                active: storage.active === index ? 0 : storage.active,
                cacheId: storage.cacheId,
                presets: ClonedList.remove(storage.presets, index),
            })

            setSelectedIndex(newActiveIndex ?? -1)
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
                cacheId: storage.cacheId,
                presets: ClonedList.insert(storage.presets, index, el),
            })

            setSelectedIndex(newActiveIndex ?? index)
        },
        move(oldIndex: number, newIndex: number, newActiveIndex?: number) {
            let active = storage.active

            if (active == oldIndex) {
                active = newIndex
            } else if (oldIndex < newIndex && active > oldIndex && active <= newIndex) {
                active--
            } else if (newIndex < oldIndex && active >= newIndex && active < oldIndex) {
                active++
            }

            setStorage({
                active,
                cacheId: storage.cacheId,
                presets: ClonedList.move(storage.presets, oldIndex, newIndex),
            })

            setSelectedIndex(newActiveIndex ?? newIndex)
        },
        set(index: number, el: RotationPreset, newActiveIndex?: number) {
            if (el.rotations.length) {
                const pre = getRotationIndexAndDay(storage.presets[index], new Date())
                el.date = calculateDateForRotation(
                    el,
                    pre.index,
                    Math.min(pre.day, el.fixed ? el.fixedDays : el.rotations[index].days ?? DefaultFixedDays),
                    new Date()
                )
            }

            setStorage({
                active: storage.active,
                cacheId: storage.cacheId,
                presets: ClonedList.set(storage.presets, index, el),
            })

            setSelectedIndex(newActiveIndex ?? index)
        }
    }

    function setActiveStorage(index: number) {
        setStorage({
            active: index,
            cacheId: storage.cacheId,
            presets: _.cloneDeep<RotationPreset[]>(storage.presets),
        })
    }

    return (
        <Container style={{marginTop: '2em'}} className={'artifact-rotations'}>
            <Header size={'large'}>Manage Presets</Header>
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
                            <Table.Row key={k} className={k === selectedIndex ? 'selected': ''}
                                       onClick={
                                           () => setSelectedIndex(k == selectedIndex ? -1 : k)
                                       }
                            >
                                <Table.Cell verticalAlign={'top'}>{k + 1}</Table.Cell>
                                <Table.Cell verticalAlign={'top'}>
                                    {k === storage.active ? (
                                        <strong>{preset.name}</strong>
                                    ) : (
                                        preset.name
                                    )}
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
                            {selectedIndex === k &&
                                <Table.Row key={k} className={'selected'}>
                                    <Table.Cell colSpan={4}>
                                        <AddEditPreset
                                            index={k}
                                            closeAccordion={() => setSelectedIndex(-1)}
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
                                    closeAccordion={() => setSelectedIndex(-1)}
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