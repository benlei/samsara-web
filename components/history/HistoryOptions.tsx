import React, {Dispatch, SetStateAction} from "react";
import {CheckboxProps, Form, Icon, Label, Radio} from "semantic-ui-react";
import {BannerFilterSortOptions, BannerOptionSetters} from "@/banners/types";

type Properties = {
    showLimitedOnly: boolean
    expand: boolean
    setExpand: Dispatch<SetStateAction<any>>
} & BannerFilterSortOptions & BannerOptionSetters

type States = {}

export default class HistoryOptions extends React.Component<Properties, States> {
    handleSortByChange = (event: React.FormEvent<HTMLInputElement>, {value}: CheckboxProps) => this.props.setSortBy(String(value))
    flipOrder = () => this.props.setOrder(this.props.order == 'desc' ? 'asc' : 'desc')

    handleChangeLimitedOnly = () => this.props.setLimitedOnly(!this.props.limitedOnly)
    handleExpand = () => this.props.setExpand(!this.props.expand)

    componentDidMount = () => {
        this.setState({ssrClientResetter: ""})
    }

    render() {
        return <>
            <Form>
                <Form.Field>
                    <label>Sort By</label>
                    <Form.Group widths='equal' inline>
                        <Form.Radio
                            autoComplete={'off'}
                            label='Last Patch Run'
                            value='last'
                            checked={this.props.sortBy === 'last'}
                            onChange={this.handleSortByChange}
                        />
                        <Form.Radio
                            autoComplete={'off'}
                            label='First Patch Run'
                            value='first'
                            checked={this.props.sortBy === 'first'}
                            onChange={this.handleSortByChange}
                        />
                        <Form.Radio
                            autoComplete={'off'}
                            label='Name'
                            value='name'
                            checked={this.props.sortBy === 'name'}
                            onChange={this.handleSortByChange}
                        />
                    </Form.Group>
                    <Form.Group widths='equal' inline>
                        <Form.Radio
                            autoComplete={'off'}
                            label='Total Runs (by last patch)'
                            value='runs-last'
                            checked={this.props.sortBy === 'runs-last'}
                            onChange={this.handleSortByChange}
                        />
                        <Form.Radio
                            autoComplete={'off'}
                            label='Total Runs (by first patch)'
                            value='runs-first'
                            checked={this.props.sortBy === 'runs-first'}
                            onChange={this.handleSortByChange}
                        />
                        <Form.Field>
                        </Form.Field>
                    </Form.Group>
                </Form.Field>


                <Form.Group widths='equal'>
                    <Form.Field>
                        <Label onClick={this.flipOrder} className={'button'} size={'large'}>
                            {this.props.order === 'asc' ? (
                                <>
                                    <Icon name={'sort amount up'} size={'small'}/> Ascending
                                </>
                            ) : (
                                <>
                                    <Icon name={'sort amount down'} size={'small'}/> Descending
                                </>
                            )}
                        </Label>
                    </Form.Field>

                    <Form.Field>
                        <Radio toggle label='Expand'
                               onChange={this.handleExpand}
                               checked={this.props.expand}
                               className={'desktop'}
                               autoComplete={'off'}
                        />
                    </Form.Field>

                    <Form.Field>
                        {this.props.showLimitedOnly && (
                            <Radio toggle label='Hide One-Offs'
                                   onChange={this.handleChangeLimitedOnly}
                                   checked={!!this.props.limitedOnly}
                                   autoComplete={'off'}
                            />
                        )}
                    </Form.Field>
                </Form.Group>
            </Form>
        </>;
    }
}