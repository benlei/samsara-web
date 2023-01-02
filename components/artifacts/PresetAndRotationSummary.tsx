import {Accordion, Container, Icon, Table} from "semantic-ui-react";
import React, {useState} from "react";
import {ArtifactRotationData, RotationStorage} from "@/artifacts/types";
import ArtifactDomain from "@/components/artifacts/ArtifactDomain";
import {AddEditPreset} from "@/components/artifacts/presets/AddEditPreset";

type Property = {
    data: ArtifactRotationData
    storage: RotationStorage
    setStorage: (storage: RotationStorage) => any
}

function isEmptyStorage(storage: RotationStorage): boolean {
    return (storage.presets?.length === 1
            || storage.presets?.length === 0)
        && storage.presets?.[0]?.rotations.data.length === 0
}

export default function PresetAndRotationSummary({
                                                     data,
                                                     storage,
                                                 }: Property) {
    const [accordionIndex, setAccordianIndex] = useState(-1)

    if (isEmptyStorage(storage)) {
        return null
    }

    return (
        <Container style={{marginTop: '2em'}} className={'artifact-rotations'}>
            <Table unstackable>
                <Table.Header>
                    <Table.Row>
                        <Table.HeaderCell style={{width: '3rem'}}>#</Table.HeaderCell>
                        <Table.HeaderCell style={{width: '20rem'}}>Preset Name</Table.HeaderCell>
                        <Table.HeaderCell>Current Rotation</Table.HeaderCell>
                        <Table.HeaderCell>Next Rotation</Table.HeaderCell>
                    </Table.Row>
                </Table.Header>

                <Table.Body>
                    {storage.presets?.map((preset, k) =>
                        <>
                            <Table.Row key={k}>
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
                                    <ArtifactDomain data={data} domain={'Ridge Watch'}/>
                                </Table.Cell>
                                <Table.Cell verticalAlign={'top'}>
                                    <ArtifactDomain data={data} domain={'Momiji-Dyed Court'}/>
                                </Table.Cell>
                            </Table.Row>
                            {accordionIndex === k &&
                                <Table.Row key={k}>
                                    <Table.Cell colSpan={4}>
                                        <AddEditPreset
                                            index={k}
                                            storage={storage}
                                            // data={data}
                                            // preset={preset}
                                            // phase={phase}
                                            // setPhase={setPhase}
                                        />
                                    </Table.Cell>
                                </Table.Row>
                            }
                        </>
                    )}
                </Table.Body>
            </Table>
        </Container>
    )
}