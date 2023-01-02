import React from "react";
import {Container, Grid, Header, Icon, List, Segment} from "semantic-ui-react";

export default function Footer({children}: React.PropsWithChildren) {
    return (
        <>
            <Segment inverted vertical style={{margin: '5em 0em 0em', padding: '5em 0em'}}>
                <Container textAlign='center'>
                    <Grid divided inverted stackable>
                        <Grid.Column width={6}>
                            <Header inverted as='h4' content='Links'/>
                            <List link inverted>
                                <List.Item as={'a'} href={'https://github.com/genshin-samsara/samsara-ssr'}>
                                    <Icon name={'github'}/> GitHub
                                </List.Item>
                            </List>
                        </Grid.Column>
                        <Grid.Column width={10} textAlign={'left'}>
                            <Header inverted as='h4' content='About'/>
                            <p>
                                This hobby site currently does not directly store any data about its users. It is,
                                however, hosted using <a href={'https://pages.cloudflare.com/'}>Cloudflare Pages</a>.
                            </p>

                            <p>
                                However this site currently does store data onto your browser&#39;s local storage if you
                                use the Artifact Rotations feature - for persistence purposes. This is necessary for
                                the functionality of this feature from this site.
                            </p>

                            <p>
                                There may be bugs, so if you think you&apos;ve found one feel free to create a GitHub
                                issue! Note that there are currently no plans for localization (I am not a FE
                                developer), but if someone wants to set such a system up, feel free to create
                                some (small, digestable) PRs!
                            </p>
                        </Grid.Column>
                    </Grid>
                </Container>
            </Segment>
        </>
    )
}
