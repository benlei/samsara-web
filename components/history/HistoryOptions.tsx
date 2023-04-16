import React, {Dispatch, SetStateAction} from "react";
import {Button, CheckboxProps, Form, Icon, Label, Radio} from "semantic-ui-react";
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
            <Button.Group widths={3}>
                <Button>
                    Last Run <Icon name={'sort'} />
                </Button>
                <Button>
                    First Run <Icon name={'sort'} />
                </Button>
                <Button>
                    Total Runs <Icon name={'sort'} />
                </Button>
            </Button.Group>
            </>;
        // return <>
        //     <Form>
        //         <Form.Field>
        //             <label>Sort By</label>
        //             <Form.Group widths='equal' inline>
        //                 <Form.Radio
        //                     autoComplete={'off'}
        //                     label='Last Patch Run'
        //                     value='last'
        //                     checked={this.props.sortBy === 'last'}
        //                     onChange={this.handleSortByChange}
        //                 />
        //                 <Form.Radio
        //                     autoComplete={'off'}
        //                     label='First Patch Run'
        //                     value='first'
        //                     checked={this.props.sortBy === 'first'}
        //                     onChange={this.handleSortByChange}
        //                 />
        //                 {/*<Form.Radio*/}
        //                 {/*    autoComplete={'off'}*/}
        //                 {/*    label='Name'*/}
        //                 {/*    value='name'*/}
        //                 {/*    checked={this.props.sortBy === 'name'}*/}
        //                 {/*    onChange={this.handleSortByChange}*/}
        //                 {/*/>*/}
        //             </Form.Group>
        //             <Form.Group widths='equal' inline>
        //                 <Form.Radio
        //                     autoComplete={'off'}
        //                     label='Total Runs (by last patch)'
        //                     value='runs-last'
        //                     checked={this.props.sortBy === 'runs-last'}
        //                     onChange={this.handleSortByChange}
        //                 />
        //                 {/*<Form.Radio*/}
        //                 {/*    autoComplete={'off'}*/}
        //                 {/*    label='Total Runs (by first patch)'*/}
        //                 {/*    value='runs-first'*/}
        //                 {/*    checked={this.props.sortBy === 'runs-first'}*/}
        //                 {/*    onChange={this.handleSortByChange}*/}
        //                 {/*/>*/}
        //                 <Form.Field>
        //                 </Form.Field>
        //             </Form.Group>
        //         </Form.Field>
        //     </Form>
        // </>;
    }
}