import {Form, Icon, Input, Label, Radio} from "semantic-ui-react";
import React, {useState} from "react";
import _ from "lodash";
import {VersionParts} from "@/banners/types";

type BaseProperties = {
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

type Properties = {
    metric: string
    setMetric: (metric: string) => void
    unit: string
    setUnit: (unit: string) => void
} & BaseProperties


export default function SummaryOptions(
    props: BaseProperties
) {
    const [metric, setMetric] = useState(props.sortBy.split('-')[0])
    const [unit, setUnit] = useState(props.sortBy.split('-')[1])

    function updateMetric(newMetric: string) {
        setMetric(newMetric)

        if (newMetric === 'runs') {
            props.setSortBy(newMetric)
        } else {
            props.setSortBy(newMetric + '-' + unit)
        }
    }

    function updateUnit(newUnit: string) {
        setUnit(newUnit)
        if (metric !== 'runs') {
            props.setSortBy(metric + '-' + newUnit)
        }
    }

    return (
        <>
            <DesktopSummaryOptions {...props}
                                   metric={metric} setMetric={updateMetric}
                                   unit={unit} setUnit={updateUnit}
            />
            <MobileSummaryOptions {...props}
                                  metric={metric} setMetric={updateMetric}
                                  unit={unit} setUnit={updateUnit}
            />
        </>
    )
}

export function DesktopSummaryOptions(
    {
        order,
        limitedOnly,
        setOrder,
        setLimitedOnly,
        showLimitedOnly = false,
        setFilterText,
        expand,
        setExpand,
        metric,
        setMetric,
        unit,
        setUnit,
    }: Properties
) {
    return (
        <>
            <Form className={'desktop'}>
                <Form.Group widths='equal'>
                    <Form.Field>
                        <label>Sort By Metric</label>
                        <Form.Group widths='equal'>
                            <Form.Radio
                                label='Since Last Run'
                                value='last'
                                checked={metric === 'last'}
                                onChange={() => setMetric('last')}
                                autoComplete={'off'}
                            />
                        </Form.Group>

                        <Form.Group widths='equal'>
                            <Form.Radio
                                label='Longest Wait Leaderboard'
                                value='longest'
                                checked={metric === 'longest'}
                                onChange={() => setMetric('longest')}
                                autoComplete={'off'}
                            />
                        </Form.Group>

                        <Form.Group widths='equal'>
                            <Form.Radio
                                label='Shortest Wait Leaderboard'
                                value='shortest'
                                checked={metric === 'shortest'}
                                onChange={() => setMetric('shortest')}
                                autoComplete={'off'}
                            />
                        </Form.Group>

                        <Form.Group widths='equal'>
                            <Form.Radio
                                label='Historical Average Wait'
                                value='avg'
                                checked={metric === 'avg'}
                                onChange={() => setMetric('avg')}
                                autoComplete={'off'}
                            />
                        </Form.Group>

                        <Form.Group widths='equal'>
                            <Form.Radio
                                label={'Total runs'}
                                value='runs'
                                checked={metric === 'runs'}
                                onChange={() => setMetric('runs')}
                                autoComplete={'off'}
                            />
                        </Form.Group>
                    </Form.Field>
                    <Form.Field>
                        <label>Sort By Unit</label>
                        <Form.Group widths='equal'>
                            <Form.Radio
                                label={'Days'}
                                value='day'
                                checked={unit === 'day'}
                                onChange={() => setUnit('day')}
                                autoComplete={'off'}
                            />
                        </Form.Group>
                        <Form.Group widths='equal'>
                            <Form.Radio
                                label={'Banners'}
                                value='banner'
                                checked={unit === 'banner'}
                                onChange={() => setUnit('banner')}
                                autoComplete={'off'}
                            />
                        </Form.Group>
                        <Form.Group widths='equal'>
                            <Form.Radio
                                label={'Patches'}
                                value='patch'
                                checked={unit === 'patch'}
                                onChange={() => setUnit('patch')}
                                autoComplete={'off'}
                            />
                        </Form.Group>
                    </Form.Field>
                </Form.Group>
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


export function MobileSummaryOptions(
    {
        order,
        limitedOnly,
        setOrder,
        setLimitedOnly,
        showLimitedOnly = false,
        setFilterText,
        expand,
        setExpand,
        metric,
        setMetric,
        unit,
        setUnit,
    }: Properties
) {

    return (
        <>
            <Form className={'mobile'} style={{display: 'none'}}>
                <Form.Field>
                    <label>Sort By Metric</label>
                    <Form.Group widths='equal'>
                        <Form.Radio
                            label='Since Last Run'
                            value='last'
                            checked={metric === 'last'}
                            onChange={() => setMetric('last')}
                            autoComplete={'off'}
                        />
                    </Form.Group>
                    <Form.Group widths='equal'>
                        <Form.Radio
                            label='Longest Wait Leaderboard'
                            value='longest'
                            checked={metric === 'longest'}
                            onChange={() => setMetric('longest')}
                            autoComplete={'off'}
                        />
                    </Form.Group>
                    <Form.Group widths='equal'>
                        <Form.Radio
                            label='Shortest Wait Leaderboard'
                            value='shortest'
                            checked={metric === 'shortest'}
                            onChange={() => setMetric('shortest')}
                            autoComplete={'off'}
                        />
                    </Form.Group>

                    <Form.Group widths='equal'>
                        <Form.Radio
                            label='Historical Average Wait'
                            value='avg'
                            checked={metric === 'avg'}
                            onChange={() => setMetric('avg')}
                            autoComplete={'off'}
                        />
                    </Form.Group>

                    <Form.Group widths='equal'>
                        <Form.Radio
                            label={'Total runs'}
                            value='runs'
                            checked={metric === 'runs'}
                            onChange={() => setMetric('runs')}
                            autoComplete={'off'}
                        />
                    </Form.Group>
                </Form.Field>
                <Form.Field>
                    <label>Sort By Unit</label>
                    <Form.Group widths='equal'>
                        <Form.Radio
                            label={'Days'}
                            value='day'
                            checked={unit === 'day'}
                            onChange={() => setUnit('day')}
                            autoComplete={'off'}
                        />
                    </Form.Group>
                    <Form.Group widths='equal'>
                        <Form.Radio
                            label={'Banners'}
                            value='banner'
                            checked={unit === 'banner'}
                            onChange={() => setUnit('banner')}
                            autoComplete={'off'}
                        />
                    </Form.Group>

                    <Form.Group widths='equal'>
                        <Form.Radio
                            label={'Patches'}
                            value='patch'
                            checked={unit === 'patch'}
                            onChange={() => setUnit('patch')}
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