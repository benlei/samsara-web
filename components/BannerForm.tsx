'use client';

import React, {useState} from "react";
import {Button, Form, Icon, Label} from "semantic-ui-react";


export default function BannerForm() {
    const [something, setSomething] = useState(true)

    function handleClick(e: React.MouseEvent<HTMLButtonElement, MouseEvent>) {
        setSomething(!something)

        e.preventDefault()
    }

    return (
        <>
            <Form style={{marginBottom: '13em'}}>
                <Form.Group inline>
                    <label>Sort By</label>
                    <Form.Radio
                        label='First Patch'
                        value='first'
                    />
                    <Form.Radio
                        label='Last Patch'
                        value='latest'
                    />
                    <Form.Radio
                        label='Total Runs'
                        value='runs'
                    />
                    <Label>
                        <Icon name={'sort amount down'} size={'small'}/> {something ? 'Descending' : 'Ascending'}
                    </Label>

                </Form.Group>

                <Form.Checkbox label='Hide Standard Characters'/>
            </Form>
            <button onClick={handleClick}>Click Here</button>
        </>
    )
}