import React, {Dispatch, SetStateAction, useState} from "react";
import {Button, CheckboxProps, Form, Icon, Label, LabelProps} from "semantic-ui-react";
import {BannerOptions, BannerOptionSetters} from "@/banners/types";

type Properties = {
    showLimitedOnly: boolean
} & BannerOptions & BannerOptionSetters

type States = {}

type SortByEvent = {
    value: string
}

export default class BannerOptionsComponent extends React.Component<Properties, States> {
    handleSortByChange = (event: React.FormEvent<HTMLInputElement>, {value}: CheckboxProps) => this.props.setSortBy(String(value))
    flipOrder = () => this.props.setOrder(this.props.order == 'desc' ? 'asc' : 'desc')

    handleChangeLimitedOnly = () => this.props.setLimitedOnly(!this.props.limitedOnly)

    componentDidMount = () => {
        this.props.setSortBy('last');
        this.props.setOrder('desc');
        this.props.setLimitedOnly(false);
    }

    getOrderElement = () => {
        if (this.props.order == 'asc') {
            return <>
                <Icon name={'sort amount up'} size={'small'}/> Ascending
            </>
        }

        return <>
            <Icon name={'sort amount down'} size={'small'}/> Descending
        </>
    }

    render() {
        return <>
            <Form>
                <Form.Field>
                    <label>Sort By</label>
                    <Form.Group inline>
                        <Form.Radio
                            label='Last Patch Run'
                            value='last'
                            checked={this.props.sortBy === 'last'}
                            onChange={this.handleSortByChange}
                        />
                        <Form.Radio
                            label='First Patch Run'
                            value='first'
                            checked={this.props.sortBy === 'first'}
                            onChange={this.handleSortByChange}
                        />
                        <Form.Radio
                            label='Total Runs'
                            value='runs'
                            checked={this.props.sortBy === 'runs'}
                            onChange={this.handleSortByChange}
                        />
                        <Form.Radio
                            label='Name'
                            value='name'
                            checked={this.props.sortBy === 'name'}
                            onChange={this.handleSortByChange}
                        />
                        <Label onClick={this.flipOrder} className={'button'}>
                            {this.getOrderElement()}
                        </Label>
                    </Form.Group>
                </Form.Field>

                {this.props.showLimitedOnly && (
                    <Form.Field>
                        <Form.Checkbox label='Hide Standard Characters'
                                       onChange={this.handleChangeLimitedOnly}
                                       checked={this.props.limitedOnly ?? false}
                        />
                    </Form.Field>
                )}
            </Form>
        </>;
    }
}