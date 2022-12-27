import React from "react";
import {Container, Divider, Dropdown, Grid, Header, Icon, List, Menu, Segment} from "semantic-ui-react";

export default function Footer({children}: React.PropsWithChildren) {
    return (
        <>
            <Segment inverted vertical style={{ margin: '5em 0em 0em', padding: '5em 0em' }}>
                <Container textAlign='center'>
                    <Grid divided inverted stackable>
                        {/*<Grid.Column width={4}>*/}
                        {/*    <Header inverted as='h4' content='Community' />*/}
                        {/*    <List link inverted>*/}
                        {/*        <List.Item as='a'>N/A</List.Item>*/}
                        {/*    </List>*/}
                        {/*</Grid.Column>*/}
                        <Grid.Column width={6}>
                            <Header inverted as='h4' content='Links' />
                            <List link inverted>
                                <List.Item as={'a'} href={'https://github.com/genshin-samsara/samsara-ssr'}>
                                    <Icon name={'github'} /> GitHub
                                </List.Item>
                            </List>
                        </Grid.Column>
                        <Grid.Column width={10} textAlign={'left'}>
                            <Header inverted as='h4' content='About' />
                            <p>
                                This hobby site currently does not directly store any data about its users. It is,
                                however, hosted using <a href={'https://pages.cloudflare.com/'}>Cloudflare Pages</a>.
                            </p>

                            <p>
                                There may be bugs, so if you think you&apos;ve found one feel free to create a GitHub
                                issue! Note that there are currently no plans for localization (I am not a FE
                                developer), but if someone wants to set such a system up, feel free to create
                                some (small, digestable) PRs!
                            </p>
                        </Grid.Column>
                    </Grid>

                    {/*<Divider inverted section />*/}
                    {/*<List horizontal inverted divided link size='small'>*/}
                    {/*    <List.Item as='a' href='#'>*/}
                    {/*        Site Map*/}
                    {/*    </List.Item>*/}
                    {/*    <List.Item as='a' href='#'>*/}
                    {/*        Contact Us*/}
                    {/*    </List.Item>*/}
                    {/*    <List.Item as='a' href='#'>*/}
                    {/*        Terms and Conditions*/}
                    {/*    </List.Item>*/}
                    {/*    <List.Item as='a' href='#'>*/}
                    {/*        Privacy Policy*/}
                    {/*    </List.Item>*/}
                    {/*</List>*/}
                </Container>
            </Segment>
        </>
    )
}
