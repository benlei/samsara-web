import React from "react";
import {Container, Divider, Dropdown, Icon, Menu} from "semantic-ui-react";
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
                    <Dropdown text='Character Banners' pointing className={'link item '+ getCharacterBannerActive()}>
                        <Dropdown.Menu>
                            <Dropdown.Item as={'a'} href='/5star/characters/summary'>5 <Icon name={'star'}/> Summary</Dropdown.Item>
                            <Dropdown.Item as={'a'} href='/5star/characters'>5 <Icon name={'star'}/> History</Dropdown.Item>
                            <Dropdown.Divider/>
                            <Dropdown.Item as={'a'} href='/4star/characters/summary'>4 <Icon name={'star'}/> Summary</Dropdown.Item>
                            <Dropdown.Item as={'a'} href='/4star/characters'>4 <Icon name={'star'}/> History</Dropdown.Item>
                        </Dropdown.Menu>
                    </Dropdown>
                    <Dropdown text='Weapon Banners' pointing className={'link item ' + getWeaponBannerActive()}>
                        <Dropdown.Menu>
                            <Dropdown.Item as={'a'} href='/5star/weapons/summary'>5 <Icon name={'star'}/> Summary</Dropdown.Item>
                            <Dropdown.Item as={'a'} href='/5star/weapons'>5 <Icon name={'star'}/> History</Dropdown.Item>
                            <Dropdown.Divider/>
                            <Dropdown.Item as={'a'} href='/4star/weapons/summary'>4 <Icon name={'star'}/> Summary</Dropdown.Item>
                            <Dropdown.Item as={'a'} href='/4star/weapons'>4 <Icon name={'star'}/>History</Dropdown.Item>
                        </Dropdown.Menu>
                    </Dropdown>
                    <Dropdown text='Artifact Rotations' pointing className={'link item ' + getrtifactRotationActive()}>
                        <Dropdown.Menu>
                            <Dropdown.Item as={'a'} href='/artifacts'>Overview</Dropdown.Item>
                            <Dropdown.Item as={'a'} href='/artifacts/presets'>Manage Presets</Dropdown.Item>
                            <Dropdown.Item as={'a'} href='/artifacts/manage'>Manage Rotations</Dropdown.Item>
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
                <Dropdown text='Banners' pointing className={'link item'}>
                    <Dropdown.Menu>
                        <Dropdown.Header>Characters Banners</Dropdown.Header>
                        <Dropdown.Item as={'a'} href='/'>5 <Icon name={'star'}/> Summary</Dropdown.Item>
                        <Dropdown.Item as={'a'} href='/5star/characters'>5 <Icon name={'star'}/> History</Dropdown.Item>
                        <Dropdown.Item as={'a'} href='/4star/characters/summary'>4 <Icon name={'star'}/> Summary</Dropdown.Item>
                        <Dropdown.Item as={'a'} href='/4star/characters'>4 <Icon name={'star'}/> History</Dropdown.Item>
                        <Dropdown.Divider/>
                        <Dropdown.Header>Weapons Banners</Dropdown.Header>
                        <Dropdown.Item as={'a'} href='/5star/weapons/summary'>5 <Icon name={'star'}/> Summary</Dropdown.Item>
                        <Dropdown.Item as={'a'} href='/5star/weapons'>5 <Icon name={'star'}/> History</Dropdown.Item>
                        <Dropdown.Item as={'a'} href='/4star/weapons/summary'>4 <Icon name={'star'}/> Summary</Dropdown.Item>
                        <Dropdown.Item as={'a'} href='/4star/weapons'>4 <Icon name={'star'}/> History</Dropdown.Item>
                    </Dropdown.Menu>
                </Dropdown>
                <Dropdown text='Tools' pointing className={'link item'}>
                    <Dropdown.Menu>
                        <Dropdown.Header>Artifact Rotations</Dropdown.Header>
                        <Dropdown.Item as={'a'} href='/artifacts'>Overview</Dropdown.Item>
                        <Dropdown.Item as={'a'} href='/artifacts/presets'>Manage Presets</Dropdown.Item>
                        <Dropdown.Item as={'a'} href='/artifacts/manage'>Manage Rotations</Dropdown.Item>
                        <Dropdown.Divider/>
                        <Dropdown.Header>Resin</Dropdown.Header>
                        <Dropdown.Item as={'a'} href='/resin'>24H Resin Timer</Dropdown.Item>
                    </Dropdown.Menu>
                </Dropdown>
            </Menu>
        </Container>
    )
}
