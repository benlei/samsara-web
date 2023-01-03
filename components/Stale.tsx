import {Card, Container, Image} from "semantic-ui-react";

export default function Stale() {
    return (
        <Container text style={{marginTop: '2em'}}>
            <Card centered fluid>
                <Image src='/images/PaimonDizzy.png' wrapped ui={false} alt={'dizzy'} />
                <Card.Content>
                    <Card.Header>You broke the site!</Card.Header>
                    <Card.Meta>
                        <span className='date'>Did you make changes on a separate tab?</span>
                    </Card.Meta>
                    <Card.Description>
                        Please refresh the page so that the changes from your other tab can be loaded!
                    </Card.Description>
                </Card.Content>
            </Card>
        </Container>
    )
}