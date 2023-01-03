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

    function getrtifactRotationActive() {
        return asPath == '/artifacts' ? 'active' : ''
    }

    return (
        <>
            <Container style={{marginTop: '.5em'}} className={'desktop'}>
                <Menu secondary pointing>
                    <Menu.Item as={'a'} href='/'>
                        <Icon name={'home'}/> Samsara
                    </Menu.Item>
                    <Dropdown text='Character Banners' pointing className={'link item '}>
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
                    <Dropdown text='Artifact Rotations' pointing className={'link item ' + getrtifactRotationActive()}>
                        <Dropdown.Menu>
                            <Dropdown.Item as={'a'} href='/artifacts'>Overview</Dropdown.Item>
                            <Dropdown.Item as={'a'} href='/artifacts/manage'>Manage Rotations</Dropdown.Item>
                            <Dropdown.Item as={'a'} href='/artifacts/presets'>Manage Presets</Dropdown.Item>
                        </Dropdown.Menu>
                    </Dropdown>
                    <Menu.Item as={'a'} href={'/resin'} className={getResinActive()}>Resin Timer</Menu.Item>
                </Menu>
            </Container>
        </>
    )
}


export function NavbarMobile() {
    return (
        <Container style={{marginTop: '.5em', display: 'none'}} className={'mobile'}>
            <Menu secondary pointing>
                <Menu.Item as={'a'} href='/'>
                    <Icon name={'home'}/> Samsara
                </Menu.Item>
                <Dropdown text='Menu' pointing className={'link item'}>
                    <Dropdown.Menu>
                        <Dropdown.Header>Characters Banners</Dropdown.Header>
                        <Dropdown.Item as={'a'} href='/'>5 <Icon name={'star'}/></Dropdown.Item>
                        <Dropdown.Item as={'a'} href='/4star/characters'>4 <Icon name={'star'}/></Dropdown.Item>
                        <Dropdown.Divider/>
                        <Dropdown.Header>Weapons Banners</Dropdown.Header>
                        <Dropdown.Item as={'a'} href='/5star/weapons'>5 <Icon name={'star'}/></Dropdown.Item>
                        <Dropdown.Item as={'a'} href='/4star/weapons'>4 <Icon name={'star'}/></Dropdown.Item>
                        <Dropdown.Divider/>
                        <Dropdown.Header>Artifact Rotations</Dropdown.Header>
                        <Dropdown.Item as={'a'} href='/artifacts'>Overview</Dropdown.Item>
                        <Dropdown.Item as={'a'} href='/artifacts/manage'>Manage Rotations</Dropdown.Item>
                        <Dropdown.Item as={'a'} href='/artifacts/presets'>Manage Presets</Dropdown.Item>
                        <Dropdown.Divider/>
                        <Dropdown.Header>Resin</Dropdown.Header>
                        <Dropdown.Item as={'a'} href='/resin'>24H Resin Timer</Dropdown.Item>
                    </Dropdown.Menu>
                </Dropdown>
            </Menu>
        </Container>
    )
}
