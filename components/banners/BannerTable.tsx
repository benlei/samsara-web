import React from "react";
import {BannerFilterSortOptions, ResourceBanner, VersionParts} from "@/banners/types";
import {Table} from "semantic-ui-react";
import _ from "lodash";
import BannerHeader from "@/components/banners/BannerHeader";
import BannerFooter from "@/components/banners/BannerFooter";
import BannerRow from "@/components/banners/BannerRow";


type BannerRundownProps = {
    bannerType: string
    versionParts: VersionParts[]
    rundown: ResourceBanner[]
    standards?: string[]
} & BannerFilterSortOptions

type BannerRundownState = {
    filterText: string | null
}

export default class BannerTable extends React.Component<BannerRundownProps, BannerRundownState> {
    constructor(props: BannerRundownProps) {
        super(props);
        this.state = {
            filterText: null
        }
    }

    private getFilteredRundown(filterText: string) {
        let filterFunc = (r: ResourceBanner) => r.name.toLowerCase().includes(filterText!.toLowerCase())
        if (filterText.startsWith('/') && filterText.endsWith('/')) {
            try {
                const re = new RegExp(filterText.substring(1, filterText.length - 1), 'i')
                filterFunc = (r: ResourceBanner) => re.test(r.name)
            } catch (ignore) {

            }
        }

        const filteredRundown = _.chain(this.props.rundown)
            .filter(filterFunc)
            .value()

        if (filteredRundown.length) {
            return filteredRundown
        }
        return this.props.rundown;
    }

    handleFilterChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        this.setState({filterText: event.target.value});
    }

    componentDidMount = () => {
        this.setState({filterText: ''});
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
                return this.sortByName
        }
    }

    render() {
        let {versionParts, bannerType, rundown} = this.props
        let {filterText} = this.state
        if (filterText) {
            rundown = this.getFilteredRundown(filterText);
        }

        rundown = _.chain(rundown)
            .filter(this.isLimitedFilter)
            .orderBy(this.getSortFunction(), this.props.order === 'asc' ? 'asc' : 'desc')
            .value()

        return (
            <>
                <Table definition unstackable selectable compact className={'history'}>
                    <BannerHeader
                        versionParts={versionParts}
                        onChange={this.handleFilterChange}
                        bannerType={bannerType}
                        filterText={filterText}
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
