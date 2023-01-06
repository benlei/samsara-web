import React from "react";
import {BannerFilterSortOptions, ResourceBanner, VersionParts} from "@/banners/types";
import {Table} from "semantic-ui-react";
import _ from "lodash";
import BannerHeader from "@/components/banners/BannerHeader";
import BannerFooter from "@/components/banners/BannerFooter";
import BannerRow from "@/components/banners/BannerRow";
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
                return Array(this.getSortFunction().length).fill(this.props.order === 'asc' ? 'asc' : 'desc')
            case 'runs-first':
                return this.props.order === 'asc' ? ['asc', 'asc', 'asc'] : ['desc', 'asc', 'desc']
            case 'runs-last':
                return this.props.order === 'asc' ? ['asc', 'desc', 'asc'] : ['desc', 'desc', 'desc']
        }
    }

    render() {
        let {versionParts, bannerType, rundown} = this.props

        const filteredRundown = _.chain(this.props.rundown)
            .filter(getFilterFunction(this.state.filterText))
            .value()

        if (!filteredRundown.length) {
            rundown = filteredRundown;
        }

        rundown = _.chain(rundown)
            .filter(this.isLimitedFilter)
            .orderBy(this.getSortFunction(), this.getOrderByOrders())
            .value()

        return (
            <>
                <Table definition unstackable selectable compact className={'history'}>
                    <BannerHeader
                        versionParts={versionParts}
                        onChange={this.handleFilterChange}
                    />
                    <Table.Body>
                        {rundown.map((r, rI) => <BannerRow key={rI}
                                                           bannerType={bannerType}
                                                           rundown={r}
                            />
                        )}
                    </Table.Body>

                    <BannerFooter versionParts={versionParts}/>
                </Table>
            </>
        );
    }
}
