import React from "react";
import {Container, Dropdown, Icon, Menu} from "semantic-ui-react";
import {useRouter} from 'next/router';

export default function Navbar({children}: React.PropsWithChildren) {
    const {asPath} = useRouter();

    function getCharacterBannerActive() {
        if (asPath === '/' || asPath.includes('/characters')) {
            return 'active'
        }
        return ''
    }

    function getWeaponBannerActive() {
        if (asPath.includes('/weapons')) {
            return 'active'
        }
        return ''
    }

    return (
        <>
            <Container style={{marginTop: '.5em'}} className={'desktop'}>
                <Menu secondary pointing>
                    <Menu.Item as={'a'} href='/'>
                        Samsara
                    </Menu.Item>
                    <Dropdown text='Character Banners' pointing className={'link item ' + getCharacterBannerActive()}>
                        <Dropdown.Menu>
                            <Dropdown.Item as={'a'} href='/5star/characters/summary'>5 <Icon
                                name={'star'}/> Summary</Dropdown.Item>
                            <Dropdown.Item as={'a'} href='/5star/characters'>5 <Icon
                                name={'star'}/> History</Dropdown.Item>
                            <Dropdown.Divider/>
                            <Dropdown.Item as={'a'} href='/4star/characters/summary'>4 <Icon
                                name={'star'}/> Summary</Dropdown.Item>
                            <Dropdown.Item as={'a'} href='/4star/characters'>4 <Icon
                                name={'star'}/> History</Dropdown.Item>
                        </Dropdown.Menu>
                    </Dropdown>
                    <Dropdown text='Weapon Banners' pointing className={'link item ' + getWeaponBannerActive()}>
                        <Dropdown.Menu>
                            <Dropdown.Item as={'a'} href='/5star/weapons/summary'>5 <Icon
                                name={'star'}/> Summary</Dropdown.Item>
                            <Dropdown.Item as={'a'} href='/5star/weapons'>5 <Icon
                                name={'star'}/> History</Dropdown.Item>
                            <Dropdown.Divider/>
                            <Dropdown.Item as={'a'} href='/4star/weapons/summary'>4 <Icon
                                name={'star'}/> Summary</Dropdown.Item>
                            <Dropdown.Item as={'a'} href='/4star/weapons'>4 <Icon
                                name={'star'}/> History</Dropdown.Item>
                        </Dropdown.Menu>
                    </Dropdown>
                </Menu>
            </Container>
        </>
    )
}


export function NavbarMobile() {
    const {asPath} = useRouter();

    function getBannerActive() {
        if (asPath === '/' || asPath.includes('/characters') || asPath.includes('/weapons')) {
            return 'active'
        }
        return ''
    }

    return (
        <Container style={{marginTop: '.5em', display: 'none'}} className={'mobile'}>
            <Menu secondary pointing>
                <Menu.Item as={'a'} href='/'>
                    Samsara
                </Menu.Item>
                <Dropdown text='Banners' pointing className={'link item ' + getBannerActive()}>
                    <Dropdown.Menu>
                        <Dropdown.Header>Character Summary</Dropdown.Header>
                        <Dropdown.Item as={'a'} href='/5star/characters/summary'>5 <Icon name={'star'}/></Dropdown.Item>
                        <Dropdown.Item as={'a'} href='/4star/characters/summary'>4 <Icon
                            name={'star'}/></Dropdown.Item>

                        <Dropdown.Divider/>

                        <Dropdown.Header>Weapon Summary</Dropdown.Header>
                        <Dropdown.Item as={'a'} href='/5star/weapons/summary'>5 <Icon
                            name={'star'}/></Dropdown.Item>
                        <Dropdown.Item as={'a'} href='/4star/weapons/summary'>4 <Icon
                            name={'star'}/></Dropdown.Item>

                        <Dropdown.Divider/>

                        <Dropdown.Header>Character History</Dropdown.Header>
                        <Dropdown.Item as={'a'} href='/5star/characters'>5 <Icon name={'star'}/></Dropdown.Item>
                        <Dropdown.Item as={'a'} href='/4star/characters'>4 <Icon name={'star'}/></Dropdown.Item>

                        <Dropdown.Divider/>

                        <Dropdown.Header>Weapon History</Dropdown.Header>
                        <Dropdown.Item as={'a'} href='/5star/weapons'>5 <Icon name={'star'}/></Dropdown.Item>
                        <Dropdown.Item as={'a'} href='/4star/weapons'>4 <Icon name={'star'}/></Dropdown.Item>
                    </Dropdown.Menu>
                </Dropdown>
            </Menu>
        </Container>
    )
}
