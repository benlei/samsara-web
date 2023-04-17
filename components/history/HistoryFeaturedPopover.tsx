import {DetailedFeaturedHistory} from "@/banners/types";
import {Card, Image, Label} from "semantic-ui-react";
import React from "react";
import {getBaseVersion} from "@/banners/version";

type Property = {
    rundown: DetailedFeaturedHistory
    type: string
}
export default function HistoryFeaturedPopover(
    {
        rundown,
        type
    }: Property
) {
    return <Card className={'history-featured-popover'}>
        <Card.Content>
            <Image
                floated='right'
                circular
                size='mini'
                src={`/images/${type}/${rundown.image}.png`}
                alt={rundown.image}
            />
            <Card.Header>{rundown.name}</Card.Header>
            <Card.Description>
                {rundown.versions.map((v, k) =>
                    <Label key={k}>{getBaseVersion(v)}</Label>
                )}
            </Card.Description>
        </Card.Content>
    </Card>

}