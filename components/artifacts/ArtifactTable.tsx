import {Accordion, AccordionTitleProps, Container, Icon, Image, Table} from "semantic-ui-react";
import ArtifactDomain from "@/components/artifacts/ArtifactDomain";
import AddEditRotation from "@/components/artifacts/rotations/AddEditRotation";
import React from "react";
import {ArtifactRotationData, ListManager, Rotation} from "@/artifacts/types";
import {getDays} from "@/artifacts/presets";

type Property = {
    data: ArtifactRotationData
    manager: ListManager<Rotation>
    activeIndex: number
    setActiveIndex: (activeIndex: number) => any
    setRotationDate: (index: number, day: number) => any
    rotationIndex: number
    rotationDay: number
}

export function ArtifactTable(
    {
        data,
        manager,
        activeIndex,
        setActiveIndex,
        setRotationDate,
        rotationIndex,
        rotationDay,
    }: Property
) {
    const handleClick = (event: any, titleProps: AccordionTitleProps) => {
        const {index} = titleProps
        const newIndex = activeIndex === index ? -1 : index

        setActiveIndex(newIndex as number)
    }


    return (
        <Container style={{marginTop: '1em'}} className={'artifact-rotations'}>
            <Table unstackable>
                <Table.Header>
                    <Table.Row>
                        <Table.HeaderCell style={{width: '3rem'}}>#</Table.HeaderCell>
                        <Table.HeaderCell style={{width: '20rem'}}>Artifacts</Table.HeaderCell>
                        <Table.HeaderCell style={{width: '12rem'}}>Intended</Table.HeaderCell>
                        <Table.HeaderCell style={{width: '40rem'}}>Info</Table.HeaderCell>
                    </Table.Row>
                </Table.Header>

                <Table.Body>
                    {data.preset.rotations.map((r, k) =>
                        <>
                            <Table.Row key={k} positive={k === rotationIndex}>
                                <Table.Cell verticalAlign={'top'}>
                                    {k + 1}
                                </Table.Cell>
                                <Table.Cell verticalAlign={'top'}>
                                    <ArtifactDomain data={data} domain={r.domain} popover/>
                                </Table.Cell>
                                <Table.Cell verticalAlign={'top'}>
                                    {r.characters.map((c, j) =>
                                        <Image
                                            avatar
                                            src={`/images/characters/${data.characters[c].image}.png`}
                                            alt={data.characters[c].image} key={j}/>
                                    )}
                                </Table.Cell>
                                <Table.Cell verticalAlign={'top'}>
                                    <Container fluid
                                               className={'grey'}>
                                        {k === rotationIndex ? (
                                            <p>
                                                Day <strong>{rotationDay}</strong> of <strong>{
                                                getDays(data.preset, k)}</strong> (active)
                                            </p>
                                        ) : (
                                            <p>
                                                <strong>
                                                    {getDays(data.preset, k)}
                                                </strong> Day{getDays(data.preset, k) !== 1 && 's'} of Rotation
                                            </p>
                                        )}

                                        {r.note.split("\n").map((note, k) =>
                                            <p key={k}>{note}</p>
                                        )}
                                    </Container>
                                    <Container fluid style={{marginTop: '.5rem'}}>
                                        <Accordion>
                                            <Accordion.Title active={activeIndex === k}
                                                             onClick={handleClick} index={k}>
                                                <Icon name='dropdown'/>
                                                {activeIndex === k ? 'Collapse' : 'Expand'} Options
                                            </Accordion.Title>
                                        </Accordion>
                                    </Container>
                                </Table.Cell>
                            </Table.Row>
                            {activeIndex === k &&
                                <AddEditRotation index={k}
                                                 rotationsManager={manager}
                                                 data={data}
                                                 setRotationDate={setRotationDate}
                                />
                            }
                        </>
                    )}

                    {!data.preset.rotations.length &&
                        <AddEditRotation index={-1}
                                         rotationsManager={manager}
                                         data={data}
                                         setRotationDate={setRotationDate}
                        />
                    }
                </Table.Body>
            </Table>
        </Container>
    )
}