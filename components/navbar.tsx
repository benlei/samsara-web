import React from "react";
import {Container, Dropdown, Icon, Menu} from "semantic-ui-react";
import {useRouter} from 'next/router';

export default function Navbar({children}: React.PropsWithChildren) {
    const {asPath} = useRouter();

    function getCharacterBannerActive() {
        if (asPath === '/' || asPath === '/4star/characters') {
            return 'active'
        }
        return ''
    }

    function getWeaponBannerActive() {
        if (asPath === '/5star/weapons' || asPath === '/4star/weapons') {
            return 'active'
        }
        return ''
    }

    function getResinActive() {
        return asPath == '/resin' ? 'active' : '';
    }

    return (
        <>
            <Container style={{marginTop: '.5em'}}>
                <Menu secondary pointing stackable>
                    <Menu.Item as={'a'} href='/'>
                        <Icon name={'home'}/> Samsara
                    </Menu.Item>
                    <Dropdown text='Character Banners' pointing className={'link item ' + getCharacterBannerActive()}>
                        <Dropdown.Menu>
                            <Dropdown.Item as={'a'} href='/'>5 <Icon name={'star'}/></Dropdown.Item>
                            <Dropdown.Item as={'a'} href='/4star/characters'>4 <Icon name={'star'}/></Dropdown.Item>
                        </Dropdown.Menu>
                    </Dropdown>
                    <Dropdown text='Weapon Banners' pointing className={'link item ' + getWeaponBannerActive()}>
                        <Dropdown.Menu>
                            <Dropdown.Item as={'a'} href='/5star/weapons'>5 <Icon name={'star'}/></Dropdown.Item>
                            <Dropdown.Item as={'a'} href='/4star/weapons'>4 <Icon name={'star'}/></Dropdown.Item>
                        </Dropdown.Menu>
                    </Dropdown>
                    <Menu.Item as={'a'} href={'/resin'} className={getResinActive()}>Resin Timer</Menu.Item>
                </Menu>
            </Container>
        </>
    )
}
