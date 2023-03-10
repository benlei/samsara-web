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

    function getResinActive() {
        return asPath == '/resin' ? 'active' : '';
    }

    function getArtifactRotationActive() {
        return asPath.includes('/artifacts') ? 'active' : ''
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
                    <Dropdown text='Artifact Rotations' pointing className={'link item ' + getArtifactRotationActive()}>
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
    const {asPath} = useRouter();

    function getBannerActive() {
        if (asPath === '/' || asPath.includes('/characters') || asPath.includes('/weapons')) {
            return 'active'
        }
        return ''
    }

    function getToolsActive() {
        return getBannerActive() === '' ? 'active' : ''
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
                <Dropdown text='Tools' pointing className={'link item ' + getToolsActive()}>
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
