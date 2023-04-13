import React from "react";
import {Container, Icon, Menu, Sidebar, Image} from "semantic-ui-react";

type SidebarItemsProps = {
    stars: 5 | 4
    type: "characters" | "weapons"
}

export default function Navbar(): JSX.Element {
    const [visible, setVisible] = React.useState(false)

    return (
        <>
            <Container style={{marginTop: '.5em'}}>
                <Menu secondary pointing className={'navmenu'}>
                    <Menu.Item as={'a'} href='/' className={'navtitle'}>
                        Samsara
                    </Menu.Item>
                    <Menu.Item as={'a'} onClick={() => setVisible(!visible)}>
                        <Icon name={'bars'}/> Menu
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
                            <Image src={'images/logo.png'} alt={'logo'} floated={'left'} size={'mini'} /> Samsara
                        </Menu.Header>
                    </Menu.Item>
                    <Menu.Item>
                        <Menu.Header>5&#x2605; Characters</Menu.Header>
                        <SidebarMenuItems stars={5} type={'characters'}/>
                    </Menu.Item>
                    <Menu.Item>
                        <Menu.Header>4&#x2605; Characters</Menu.Header>
                        <SidebarMenuItems stars={4} type={'characters'}/>
                    </Menu.Item>
                    <Menu.Item>
                        <Menu.Header>5&#x2605; Weapons</Menu.Header>
                        <SidebarMenuItems stars={5} type={'weapons'}/>
                    </Menu.Item>
                    <Menu.Item>
                        <Menu.Header>4&#x2605; Weapons</Menu.Header>
                        <SidebarMenuItems stars={4} type={'weapons'}/>
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
            <Menu.Item as={'a'} href={`/${stars}star/${type}/summary`}>Summary</Menu.Item>
            <Menu.Item as={'a'} href={`/${stars}star/${type}/summary-avg`}>Summary (Avg)</Menu.Item>
            <Menu.Item as={'a'} href={`/${stars}star/${type}/run-summary`}>Run Count</Menu.Item>
            <Menu.Item as={'a'} href={`/${stars}star/${type}/longest-leaderboard`}>Leaderboard: Longest
                Rerun</Menu.Item>
            <Menu.Item as={'a'} href={`/${stars}star/${type}/shortest-leaderboard`}>Leaderboard: Shortest
                Rerun</Menu.Item>
            <Menu.Item as={'a'} href={`/${stars}star/${type}`}>Banner History</Menu.Item>
        </Menu>
    )
}
