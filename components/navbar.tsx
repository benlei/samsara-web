import React from "react";
import {Container, Dropdown, Menu} from "semantic-ui-react";

export default function Navbar({children}: React.PropsWithChildren) {
    return (
        <>
            <Container>
                <Menu pointing secondary>
                    <Menu.Item
                        name='home'
                        active={true}
                        // onClick={this.handleItemClick}
                    />
                    <Menu.Item
                        name='messages'
                        // active={activeItem === 'messages'}
                        // onClick={this.handleItemClick}
                    />
                    <Menu.Item
                        name='friends'
                        // active={activeItem === 'friends'}
                        // onClick={this.handleItemClick}
                    />
                    <Menu.Menu position='right'>
                        <Menu.Item
                            name='logout'
                            // active={activeItem === 'logout'}
                            // onClick={this.handleItemClick}
                        />
                    </Menu.Menu>
                </Menu>
            </Container>
        </>
    )
}
