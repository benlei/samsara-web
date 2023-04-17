import {BannerHistoryDataset, DetailedFeaturedHistory, FeaturedHistory, PopoverFeaturedHistory} from "@/banners/types";
import React, {useState} from "react";
import {Container, Grid, Header, Image, Popup} from "semantic-ui-react";
import {getBaseVersion, getVersionPart} from "@/banners/version";
import _ from "lodash";
import {getImageFromName} from "@/format/image";
import {chunk} from "@/banners/summaryUtils";
import ScrollContainer from "react-indiana-drag-scroll";
import clsx from "clsx";

type Properties = {
    type: string
    dataset: BannerHistoryDataset
    rundown: DetailedFeaturedHistory
    counter: number
    versionIndex: number
}

export default function HistoryImageCounter(
    {
        type,
        dataset,
        rundown,
        counter,
        versionIndex,
    }: Properties
): React.ReactElement {
    const [open, setOpen] = useState(false)

    if (counter == -1) {
        return <div></div>

    }

    if (counter !== 0) {
        return <div>{counter}</div>
    }


    return <Popup
        content={<VersionPopover
            dataset={dataset}
            rundown={rundown}
            type={type}
            version={rundown.versions[rundown.versions.length - versionIndex - 1]}
        />}
        on='click'
        onClose={() => setOpen(false)}
        onOpen={() => setOpen(true)}
        open={open}
        // flowing
        popperModifiers={[{ name: 'preventOverflow', enabled: true }]}
        // position={'bottom center'}
        trigger={
            <Image avatar src={`/images/${type}/${rundown.image}.png`} alt={rundown.image}/>
        }
    />
}

type PopoverProperties = {
    version: string
    type: string
    dataset: BannerHistoryDataset
    rundown: DetailedFeaturedHistory
}

function VersionPopover(
    {
        version,
        type,
        dataset,
        rundown,
    }: PopoverProperties
): React.ReactElement {
    function getSameVersion(history: FeaturedHistory[], stars: number): PopoverFeaturedHistory[] {
        return _.chain(history)
            .filter((h) => _.includes(
                h.versions.map((v) => getBaseVersion(v)),
                getBaseVersion(version)
            ))
            .map((h) => {
                return {
                    stars,
                    image: getImageFromName(h.name),
                    name: h.name,
                    version: _.chain(h.versions)
                        .filter((v) => getBaseVersion(v) === getBaseVersion(version))
                        .first()
                        .value(),
                }
            })
            .value()
    }

    const featuredCharacters = chunk(
        _.chain([
            ...getSameVersion(dataset.fiveStarCharacters, 5),
            ...getSameVersion(dataset.fourStarCharacters, 4),
        ])
            .orderBy([
                (h) => h.version,
                (h) => h.stars,
                (h) => h.name,
            ], ['asc', 'desc', 'asc'])
            .value(),
        (f) => f.version,
    )

    const featuredWeapons = chunk(
        _.chain([
            ...getSameVersion(dataset.fiveStarWeapons, 5),
            ...getSameVersion(dataset.fourStarWeapons, 4),
        ])
            .orderBy([
                (h) => h.version,
                (h) => h.stars,
                (h) => h.name,
            ], ['asc', 'desc', 'asc'])
            .value(),
        (f) => f.version,
    )

    console.log(featuredWeapons)

    return <Container className={'history-popover'}>
        <ScrollContainer className="scroll-container" hideScrollbars={false}>
            <Grid stackable>
                <Grid.Column width={8}>
                    {featuredCharacters.map((fc, k) =>
                        <div className={'banners'} key={k}>
                            <Header size={'small'}>{getBaseVersion(fc[0].version)} Characters ({getVersionPart(fc[0].version)})</Header>

                            {fc.map((f, l) =>
                                <div key={l}>
                                    <Image avatar
                                           className={clsx({five: f.stars === 5, four: f.stars === 4})}
                                           src={`/images/characters/${f.image}.png`}
                                           alt={f.image}/> {f.name}
                                </div>
                            )}
                        </div>
                    )}
                </Grid.Column>

                <Grid.Column width={8}>
                    {featuredWeapons.map((fc, k) =>
                        <div className={'banners'} key={k}>
                            <Header size={'small'}>{getBaseVersion(fc[0].version)} Weapons ({getVersionPart(fc[0].version)})</Header>

                            {fc.map((f, l) =>
                                <div key={l}>
                                    <Image avatar
                                           className={clsx({five: f.stars === 5, four: f.stars === 4})}
                                           src={`/images/weapons/${f.image}.png`}
                                           alt={f.image}/> {f.name}
                                </div>
                            )}
                        </div>
                    )}
                </Grid.Column>
            </Grid>
        </ScrollContainer>
    </Container>
}