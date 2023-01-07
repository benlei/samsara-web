import {Form, Icon, Input, Label, Radio} from "semantic-ui-react";
import React from "react";
import _ from "lodash";
import { VersionParts } from "@/banners/types";

type Properties = {
    sortBy: string
    setSortBy: (sort: string) => any
    order: string
    setOrder: (order: string) => any
    limitedOnly: boolean
    setLimitedOnly: (limitedOnly: boolean) => any
    expand: boolean
    setExpand: (expand: boolean) => any
    showLimitedOnly?: boolean
    setFilterText: (text: string) => any
    latestVersionPart: VersionParts
}

export default function SummaryOptions(
    {
        sortBy,
        order,
        limitedOnly,
        setSortBy,
        setOrder,
        setLimitedOnly,
        showLimitedOnly = false,
        setFilterText,
        expand,
        setExpand,
        latestVersionPart,
    }: Properties
) {
    return (
        <>
            <Form>
                <Form.Field>
                    <label>Sort By</label>
                    <Form.Group widths='equal' inline>
                        <Form.Radio
                            label='Days since Last Run'
                            value='last-day'
                            checked={sortBy === 'last-day'}
                            onChange={() => setSortBy('last-day')}
                            autoComplete={'off'}
                        />
                        <Form.Radio
                            label={'Banners since ' + latestVersionPart.version}
                            value='last-banner'
                            checked={sortBy === 'last-banner'}
                            onChange={() => setSortBy('last-banner')}
                            autoComplete={'off'}
                        />
                        <Form.Radio
                            label={'Patches since ' + latestVersionPart.version}
                            value='last-patch'
                            checked={sortBy === 'last-patch'}
                            onChange={() => setSortBy('last-patch')}
                            autoComplete={'off'}
                        />
                    </Form.Group>
                    <Form.Group widths='equal' inline>
                        <Form.Radio
                            label='Avg. # of Days in Between'
                            value='avg-days'
                            checked={sortBy === 'avg-days'}
                            onChange={() => setSortBy('avg-days')}
                            autoComplete={'off'}
                        />
                        <Form.Radio
                            label='Avg. # of Banners in Between'
                            value='avg-banner'
                            checked={sortBy === 'avg-banner'}
                            onChange={() => setSortBy('avg-banner')}
                            autoComplete={'off'}
                        />
                        <Form.Radio
                            label='Avg. # of Patches in Between'
                            value='avg-patch'
                            checked={sortBy === 'avg-patch'}
                            onChange={() => setSortBy('avg-patch')}
                            autoComplete={'off'}
                        />
                    </Form.Group>
                    <Form.Group widths='equal' inline>
                        <Form.Radio
                            label={'Total Runs by ' + latestVersionPart.version}
                            value='runs'
                            checked={sortBy === 'runs'}
                            onChange={() => setSortBy('runs')}
                            autoComplete={'off'}
                        />
                    </Form.Group>
                </Form.Field>
                <Form.Group widths='equal'>
                    <Form.Field>
                        <Label
                            onClick={() => setOrder(order == 'desc' ? 'asc' : 'desc')}
                            className={'button'}>
                            {order == 'asc' ? (
                                <><Icon name={'sort amount up'} size={'small'}/> Ascending</>
                            ) : (
                                <><Icon name={'sort amount down'} size={'small'}/> Descending</>
                            )}
                        </Label>
                    </Form.Field>

                    <Form.Field>
                        <Radio toggle label='Expand'
                               onChange={() => setExpand(!expand)}
                               checked={expand}
                               className={'desktop'}
                               autoComplete={'off'}
                        />
                    </Form.Field>

                    <Form.Field>
                        {showLimitedOnly && (
                            <Radio toggle label='Hide One-Offs'
                                   onChange={() => setLimitedOnly(!limitedOnly)}
                                   checked={limitedOnly}
                                   autoComplete={'off'}
                            />
                        )}
                    </Form.Field>
                </Form.Group>

                <Form.Field>
                    <Input fluid
                           placeholder={'Filter name...'}
                           onChange={_.debounce((event) => setFilterText(event.target.value), 250)}
                           icon>
                        <input autoComplete={'off'}/>
                        <Icon name='search'/>
                    </Input>
                </Form.Field>
            </Form>
        </>
    )
}