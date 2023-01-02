import {Accordion, AccordionTitleProps, Container, Header, Icon, Image, Table} from "semantic-ui-react";
import ArtifactDomain from "@/components/artifacts/ArtifactDomain";
import AddEditRotation from "@/components/artifacts/rotations/AddEditRotation";
import React from "react";
import {ArtifactRotationData, RotationsManager} from "@/artifacts/types";

type Property = {
    data: ArtifactRotationData
    manager: RotationsManager
    activeIndex: number
    setActiveIndex: (activeIndex: number) => any
}

export function ArtifactTable(
    {
        data,
        manager,
        activeIndex,
        setActiveIndex,
    }: Property
) {
    const handleClick = (event: any, titleProps: AccordionTitleProps) => {
        const {index} = titleProps
        const newIndex = activeIndex === index ? -1 : index

        setActiveIndex(newIndex as number)
    }

    return (
        <Container style={{marginTop: '2em'}} className={'artifact-rotations'}>
            <Header size='large'>default Preset</Header>
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
                    {data.rotations.data.map((r, k) =>
                        <>
                            <Table.Row key={k}>
                                <Table.Cell verticalAlign={'top'}>
                                    {k + 1}
                                </Table.Cell>
                                <Table.Cell verticalAlign={'top'}>
                                    <ArtifactDomain data={data} domain={r.domain} popover/>
                                </Table.Cell>
                                <Table.Cell verticalAlign={'top'}>
                                    {r.characters.map((c, k) =>
                                        <Image
                                            avatar
                                            src={`/images/characters/${data.characters[c].image}.png`}
                                            alt={data.characters[c].image} key={k}/>
                                    )}
                                </Table.Cell>
                                <Table.Cell verticalAlign={'top'}>
                                    <Container fluid
                                               className={'grey'}>
                                        <p>
                                            <strong>{r.days ?? data.rotations.fixedDays}</strong> Rotation
                                            Day{(r.days ?? data.rotations.fixedDays) !== 1 && 's'}
                                        </p>
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
                                                 data={data}/>
                            }
                        </>
                    )}

                    {!data.rotations.data.length &&
                        <AddEditRotation index={-1}
                                         rotationsManager={manager}
                                         data={data}/>
                    }
                </Table.Body>
            </Table>
        </Container>
    )
}