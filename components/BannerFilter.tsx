'use client';

import React, {useState} from "react";
import {Button, Form, Icon, Label} from "semantic-ui-react";

type BannerFilterProps = {

}

type BannerFilterState = {

}

export default class BannerFilterComponent extends React.Component<BannerFilterProps, BannerFilterState> {

    render() {
        return <>
            <Form style={{marginBottom: '13em'}}>
                <Form.Group inline>
                    <label>Sort By</label>
                    <Form.Radio
                        label='Last Patch Run'
                        value='first'
                    />
                    <Form.Radio
                        label='First Patch Run'
                        value='latest'
                    />
                    <Form.Radio
                        label='Total Runs'
                        value='runs'
                    />
                    <Label>
                        <Icon name={'sort amount down'} size={'small'}/> Descending
                    </Label>

                </Form.Group>

                <Form.Checkbox label='Hide Standard Characters'/>
            </Form>
        </>;
    }
}

export  function BannerFilter() {
    const [something, setSomething] = useState(true)

    function handleClick(e: React.MouseEvent<HTMLButtonElement, MouseEvent>) {
        setSomething(!something)

        e.preventDefault()
    }

    return (
        <>
            <button onClick={handleClick}>Click Here</button>
        </>
    )
}