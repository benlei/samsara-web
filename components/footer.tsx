import {useTheme} from "next-themes";
import React, {useEffect, useState} from "react";
import {Container, Grid, Header, Icon, List, Radio, Segment} from "semantic-ui-react";

export default function Footer({children}: React.PropsWithChildren) {
    const {theme, setTheme} = useTheme()
    const [themeState, setThemeState] = useState('light')

    useEffect(() => {
        setThemeState(theme === 'dark' ? 'dark' : 'light')
    }, [theme])

    const toggleTheme = () => {
        setTheme(themeState === 'dark' ? 'light' : 'dark')
        setThemeState(themeState === 'dark' ? 'light' : 'dark')
    }

    return (
        <>
            <Segment vertical style={{margin: '5em 0em 0em', padding: '5em 0em'}}>
                <Container textAlign='center'>
                    <Grid divided stackable>
                        <Grid.Column width={6}>
                            <Header as='h4' content='Links'/>
                            <List link>
                                <List.Item as={'a'} href={'https://github.com/benlei/samsara-web'}>
                                    <Icon name={'github'}/> GitHub
                                </List.Item>
                            </List>


                            <Container>
                                <Radio toggle label={themeState !== 'dark' ? 'Light Mode' : 'Dark Mode'}
                                       onChange={toggleTheme}
                                       checked={themeState !== 'dark'}
                                       autoComplete={'off'}
                                />
                            </Container>
                        </Grid.Column>
                        <Grid.Column width={10} textAlign={'left'}>
                            <Header as='h4' content='About'/>
                            <p>
                                This hobby site currently does not directly store any data about its users on any
                                server. It does, however, store cookies/local storage on your browser - such as for
                                Google Analytics, and for some sections of the site necessary for its core
                                functionality (e.g. artifact rotations).
                            </p>

                            <p>
                                The data shown here is sourced from the <a
                                href={
                                    'https://genshin-impact.fandom.com/wiki/Genshin_Impact_Wiki'
                                }>Genshin Fandom</a> site.
                            </p>

                            <p>
                                There may be bugs, so if you think you&apos;ve found one feel free to create a GitHub
                                issue! Note that there are currently no plans for localization (I am not a FE
                                developer), but if someone wants to set such a system up, feel free to create
                                some (small, digestable) PRs!
                            </p>

                            <p>samsara.pages.dev is not affiliated with or endorsed by HoYoverse.</p>
                        </Grid.Column>
                    </Grid>
                </Container>
            </Segment>
        </>
    )
}
