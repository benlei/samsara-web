import React from "react";
import {BannerFilterSortOptions, ResourceBanner, VersionParts} from "@/banners/types";
import {Table} from "semantic-ui-react";
import _ from "lodash";
import HistoryHeader from "@/components/history/HistoryHeader";
import HistoryFooter from "@/components/history/HistoryFooter";
import HistoryRow from "@/components/history/HistoryRow";
import {getFilterFunction} from "@/banners/summary";


type BannerRundownProps = {
    bannerType: string
    versionParts: VersionParts[]
    rundown: ResourceBanner[]
    standards?: string[]
} & BannerFilterSortOptions

type BannerRundownState = {
    filterText: string
}

export default class BannerTable extends React.Component<BannerRundownProps, BannerRundownState> {
    constructor(props: BannerRundownProps) {
        super(props);
        this.state = {
            filterText: '',
        }
    }

    handleFilterChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        this.setState({filterText: event.target.value});
    }

    isLimitedFilter = (r: ResourceBanner) => {
        if (!this.props.limitedOnly || typeof this.props.standards === 'undefined') {
            return true
        }

        return !this.props.standards!.includes(r.name)
    }

    sortByName = (r: ResourceBanner) => r.name

    sortByRunsLastPatch = [
        (r: ResourceBanner) => String(r.banners.length),
        (r: ResourceBanner) => r.banners[r.banners.length - 1],
        this.sortByName,
    ]

    sortByRunsFirstPatch = [
        (r: ResourceBanner) => String(r.banners.length),
        (r: ResourceBanner) => r.banners[0],
        this.sortByName,
    ]

    sortByFirst = [
        (r: ResourceBanner) => r.banners[0],
        this.sortByName,
    ]

    sortByLast = [
        (r: ResourceBanner) => r.banners[r.banners.length - 1],
        this.sortByName,
    ]

    getSortFunction = () => {
        switch (this.props.sortBy) {
            default:
            case 'last':
                return this.sortByLast
            case 'first':
                return this.sortByFirst
            case 'runs-first':
                return this.sortByRunsFirstPatch
            case 'runs-last':
                return this.sortByRunsLastPatch
            case 'name':
                return [this.sortByName]
        }
    }

    getOrderByOrders = () => {
        switch (this.props.sortBy) {
            default:
                return [
                    ...Array(this.getSortFunction().length - 1).fill(this.props.order === 'asc' ? 'asc' : 'desc'),
                    this.props.order === 'asc' ? 'desc' : 'asc',
                ]
            case 'name':
                return [this.props.order === 'asc' ? 'asc' : 'desc']
            case 'runs-first':
                return this.props.order === 'asc' ? ['asc', 'asc', 'desc'] : ['desc', 'asc', 'asc']
            case 'runs-last':
                return this.props.order === 'asc' ? ['asc', 'desc', 'desc'] : ['desc', 'desc', 'asc']
        }
    }

    render() {
        let {versionParts, bannerType, rundown} = this.props

        rundown = _.chain(rundown)
            .filter(this.isLimitedFilter)
            .orderBy(this.getSortFunction(), this.getOrderByOrders())
            .value()

        const filteredRundown = _.chain(rundown)
            .filter(getFilterFunction(this.state.filterText))
            .value()

        if (filteredRundown.length) {
            rundown = filteredRundown;
        }

        return (
            <>
                <Table definition unstackable selectable compact className={'history'}>
                    <HistoryHeader
                        versionParts={versionParts}
                        onChange={this.handleFilterChange}
                    />
                    <Table.Body>
                        {rundown.map((r, rI) => <HistoryRow key={rI}
                                                            bannerType={bannerType}
                                                            rundown={r}
                            />
                        )}
                    </Table.Body>

                    <HistoryFooter versionParts={versionParts}/>
                </Table>
            </>
        );
    }
}
