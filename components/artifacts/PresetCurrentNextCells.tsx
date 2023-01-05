import {ArtifactRotationSummaryProperties, RotationPreset} from "@/artifacts/types";
import {getDays, getRotationIndexAndDay} from "@/artifacts/presets";
import {Container, Image, Label, List, Table} from "semantic-ui-react";
import ArtifactDomain from "@/components/artifacts/ArtifactDomain";
import React from "react";

type Properties = {
    preset: RotationPreset
    data: ArtifactRotationSummaryProperties
}

export default function PresetCurrentNextCells(
    {
        preset,
        data,
    }: Properties
) {
    const curr = getRotationIndexAndDay(preset, new Date())
    const next = {
        index: (curr.index + 1) % preset.rotations.length,
        day: getDays(preset, curr.index) - curr.day + 1
    }

    return (
        <>
            <Table.Cell verticalAlign={'top'}>
                <ArtifactDomain data={data} domain={preset.rotations[curr.index].domain} popover
                                additionalLabel={
                                    <>
                                        <Label basic className={'disabled'}
                                               style={{marginBottom: '.5em'}}>
                                            #{curr.index + 1}
                                        </Label>
                                        <Label basic color='blue'
                                               style={{marginBottom: '.5em'}}>
                                            Day {curr.day} of {getDays(preset, curr.index)}
                                        </Label>
                                    </>
                                }
                />

                {!!preset.rotations[curr.index].characters.length &&
                    <List style={{marginTop: '1em'}}>
                        <List.Item><strong>Intended Characters</strong></List.Item>
                        <List.Item>
                            {preset.rotations[curr.index].characters.map((c, j) =>
                                <Image
                                    avatar
                                    src={`/images/characters/${data.characters[c].image}.png`}
                                    alt={data.characters[c].image} key={j}/>
                            )}
                        </List.Item>
                    </List>
                }

                {!!preset.rotations[curr.index].note.trim().length &&
                    <Container fluid className={'grey'}>
                        {preset.rotations[curr.index].note.split("\n").map((note, k) =>
                            <p key={k}>{note}</p>
                        )}
                    </Container>
                }
            </Table.Cell>
            <Table.Cell verticalAlign={'top'}>
                <ArtifactDomain data={data} domain={preset.rotations[next.index].domain} popover
                                additionalLabel={
                                    <>

                                        <Label basic className={'disabled'}
                                               style={{marginBottom: '.5em'}}>
                                            #{next.index + 1}
                                        </Label>
                                        <Label basic color={'grey'} style={{marginBottom: '.5em'}}>
                                            In {next.day} day{next.day === 1 ? '' : 's'}
                                        </Label>
                                    </>
                                }
                />

                {!!preset.rotations[next.index].characters.length &&
                    <List style={{marginTop: '1rem'}}>
                        <List.Item><strong>Intended Characters</strong></List.Item>
                        <List.Item>
                            {preset.rotations[next.index].characters.map((c, j) =>
                                <Image
                                    avatar
                                    src={`/images/characters/${data.characters[c].image}.png`}
                                    alt={data.characters[c].image} key={j}/>
                            )}
                        </List.Item>
                    </List>
                }

                {!!preset.rotations[next.index].note.trim().length &&
                    <Container fluid className={'grey'}>
                        {preset.rotations[next.index].note.split("\n").map((note, k) =>
                            <p key={k}>{note}</p>
                        )}
                    </Container>
                }
            </Table.Cell>
        </>
    )
}