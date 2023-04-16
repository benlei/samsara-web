import React from "react";
import {Button, Icon} from "semantic-ui-react";
import {BannerFilterSortOptions, BannerOptionSetters} from "@/banners/types";
import clsx from "clsx";

type Properties = BannerFilterSortOptions & BannerOptionSetters

type States = {}

export default class HistoryOptions extends React.Component<Properties, States> {
    triggerSort = (newSort: string) => {
        if (newSort !== this.props.sortBy) {
            this.props.setSortBy(newSort)
        } else {
            this.props.setOrder(this.props.order === 'desc' ? 'asc' : 'desc')
        }
    };

    // componentDidMount = () => {
    //     // this.setState({ssrClientResetter: ""})
    // }

    render() {
        return <>
            <Button.Group widths={3}>
                <Button
                    onClick={() => this.triggerSort('last')}
                    className={clsx({active: this.props.sortBy === 'last'})}
                >
                    Latest <Icon name={'sort'} className={clsx({hidden: this.props.sortBy !== 'last'})}/>
                </Button>
                <Button
                    onClick={() => this.triggerSort('first')}
                    className={clsx({active: this.props.sortBy === 'first'})}
                >
                    Oldest <Icon name={'sort'} className={clsx({hidden: this.props.sortBy !== 'first'})}/>
                </Button>
                <Button
                    onClick={() => this.triggerSort('runs-last')}
                    className={clsx({active: this.props.sortBy === 'runs-last'})}
                >
                    Total Runs <Icon name={'sort'} className={clsx({hidden: this.props.sortBy !== 'runs-last'})}/>
                </Button>
            </Button.Group>
        </>;
    }
}