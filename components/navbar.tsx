import { useRouter } from "next/router";
import React from "react";
import {Container, Icon, Menu, Sidebar, Image, Accordion} from "semantic-ui-react";

type SidebarItemsProps = {
    stars: 5 | 4
    type: "characters" | "weapons" | "hsr-characters" | "lightcones"
}

const FiveStarChar = '/5star/c'
const FiveStarWeap = '/5star/w'
const FourStarChar = '/4star/c'
const FourStarWeap = '/4star/w'

export default function Navbar(): JSX.Element {
    const router = useRouter()
    console.log("router:", router)
    const [visible, setVisible] = React.useState(false)
    const [hsrVisible, setHsrVisible] = React.useState(false)
    const [activeMenu, setActiveMenu] = React.useState(router.pathname)

    function handleActiveMenu(newActiveMenu: string) {
        if (activeMenu === newActiveMenu) {
            return
        }
        setActiveMenu(newActiveMenu)
    }

    function in5StarChar() {
        return activeMenu === '/' || activeMenu.startsWith(FiveStarChar)
    }

    function in4StarChar() {
        return activeMenu.startsWith(FourStarChar)
    }

    function in5StarWeap() {
        return activeMenu.startsWith(FiveStarWeap)
    }

    function in4StarWeap() {
        return activeMenu.startsWith(FourStarWeap)
    }

    return (
        <>
            <Container style={{marginTop: '.5em'}}>
                <Menu secondary className={'navmenu'}>
                    <Menu.Item as={'a'} href='/' className={'navtitle'}>
                        Samsara
                    </Menu.Item>
                    <Menu.Item as={'a'} onClick={() => setVisible(!visible)}>
                        <Icon name={'bars'}/> Genshin
                    </Menu.Item>
                    <Menu.Item as={'a'} onClick={() => setHsrVisible(!hsrVisible)}>
                        <Icon name={'bars'}/> HSR
                    </Menu.Item>
                </Menu>
            </Container>
            <Sidebar.Pusher>
                <Sidebar
                    as={Menu}
                    animation='overlay'
                    icon='labeled'
                    onHide={() => setVisible(false)}
                    vertical
                    visible={visible}
                >
                    <Menu.Item>
                        <Menu.Header className={'logo'} as={'a'} href={'/'}>
                            <Image src={'/images/logo.png'} alt={'logo'} floated={'left'} size={'mini'} /> Samsara
                        </Menu.Header>
                    </Menu.Item>
                    <Menu.Item>
                        <Menu.Header>
                            Genshin Impact
                        </Menu.Header>
                    </Menu.Item>
                    <Accordion>
                        <Accordion.Title
                            active={in5StarChar()}
                            onClick={() => handleActiveMenu(FiveStarChar)}
                            as={Menu.Item}
                        >
                            <Menu.Header><Icon name='dropdown' /> 5&#x2605; Characters</Menu.Header>
                        </Accordion.Title>
                        <Accordion.Content active={in5StarChar()}>
                            <SidebarMenuItems stars={5} type={'characters'}/>
                        </Accordion.Content>

                        <Accordion.Title
                            active={in5StarWeap()}
                            onClick={() => handleActiveMenu(FiveStarWeap)}
                            as={Menu.Item}
                        >
                            <Menu.Header><Icon name='dropdown' /> 5&#x2605; Weapons</Menu.Header>
                        </Accordion.Title>
                        <Accordion.Content active={in5StarWeap()}>
                            <SidebarMenuItems stars={5} type={'weapons'}/>
                        </Accordion.Content>

                        <Accordion.Title
                            active={in4StarChar()}
                            onClick={() => handleActiveMenu(FourStarChar)}
                            as={Menu.Item}
                        >
                            <Menu.Header><Icon name='dropdown' /> 4&#x2605; Characters</Menu.Header>
                        </Accordion.Title>
                        <Accordion.Content active={in4StarChar()}>
                            <SidebarMenuItems stars={4} type={'characters'}/>
                        </Accordion.Content>

                        <Accordion.Title
                            active={in4StarWeap()}
                            onClick={() => handleActiveMenu(FourStarWeap)}
                            as={Menu.Item}
                        >
                            <Menu.Header><Icon name='dropdown' /> 4&#x2605; Weapons</Menu.Header>
                        </Accordion.Title>
                        <Accordion.Content active={in4StarWeap()}>
                            <SidebarMenuItems stars={4} type={'weapons'}/>
                        </Accordion.Content>
                    </Accordion>
                </Sidebar>
            </Sidebar.Pusher>
            <Sidebar.Pusher>
                <Sidebar
                    as={Menu}
                    animation='overlay'
                    icon='labeled'
                    onHide={() => setHsrVisible(false)}
                    vertical
                    visible={hsrVisible}
                    direction="right"
                >
                    <Menu.Item>
                        <Menu.Header className={'logo'} as={'a'} href={'/'}>
                            <Image src={'/images/logo.png'} alt={'logo'} floated={'left'} size={'mini'} /> Samsara
                        </Menu.Header>
                    </Menu.Item>
                    <Menu.Item>
                        <Menu.Header>
                            Honkai: Star Rail
                        </Menu.Header>
                    </Menu.Item>
                    <Menu.Item>
                        <Menu.Header>5&#x2605; Characters</Menu.Header>
                        <SidebarMenuItems stars={5} type={'hsr-characters'}/>
                    </Menu.Item>
                    <Menu.Item>
                        <Menu.Header>5&#x2605; Lightcones</Menu.Header>
                        <SidebarMenuItems stars={5} type={'lightcones'}/>
                    </Menu.Item>
                    <Menu.Item>
                        <Menu.Header>4&#x2605; Characters</Menu.Header>
                        <SidebarMenuItems stars={4} type={'hsr-characters'}/>
                    </Menu.Item>
                    <Menu.Item>
                        <Menu.Header>4&#x2605; Lightcones</Menu.Header>
                        <SidebarMenuItems stars={4} type={'lightcones'}/>
                    </Menu.Item>
                </Sidebar>
            </Sidebar.Pusher>
        </>
    )
}

function SidebarMenuItems(
    {
        stars,
        type
    }: SidebarItemsProps
): JSX.Element {
    return (
        <Menu vertical>
            <Menu.Item as={'a'} href={`/${stars}star/${type}`}>Banner History</Menu.Item>
            <Menu.Item as={'a'} href={`/${stars}star/${type}/summary`}>Summary</Menu.Item>
            <Menu.Item as={'a'} href={`/${stars}star/${type}/runs`}>Total Reruns</Menu.Item>
            <Menu.Item as={'a'} href={`/${stars}star/${type}/summary-avg`}>Average Reruns</Menu.Item>
            <Menu.Item as={'a'} href={`/${stars}star/${type}/longest-leaderboard`}>Leaderboard: Longest
                Rerun</Menu.Item>
            <Menu.Item as={'a'} href={`/${stars}star/${type}/shortest-leaderboard`}>Leaderboard: Shortest
                Rerun</Menu.Item>
        </Menu>
    )
}
