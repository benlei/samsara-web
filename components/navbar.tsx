import React from "react";
import {Container, Dropdown, Icon, Menu} from "semantic-ui-react";

export default function Navbar({children}: React.PropsWithChildren) {
    return (
        <>
            <Container style={{marginTop: '.5em'}}>
                <Menu>
                    <Menu.Item
                        name='home'
                        active={true}
                        // onClick={this.handleItemClick}
                    />
                    <Dropdown text='Banners' pointing className='link item'>
                        <Dropdown.Menu>
                            <Dropdown.Header>Characters</Dropdown.Header>
                            <Dropdown.Item>5 <Icon name={'star'}/></Dropdown.Item>
                            <Dropdown.Item>4 <Icon name={'star'}/></Dropdown.Item>
                            <Dropdown.Divider/>
                            <Dropdown.Header>Weapons</Dropdown.Header>
                            <Dropdown.Item>5 <Icon name={'star'}/></Dropdown.Item>
                            <Dropdown.Item>4 <Icon name={'star'}/></Dropdown.Item>
                        </Dropdown.Menu>
                    </Dropdown>
                    <Menu.Item>Forums</Menu.Item>
                    <Menu.Item>Contact Us</Menu.Item>
                </Menu>
            </Container>
        </>
    )
}
