import React from 'react'
import { Header, Transition, Container, Grid, Image } from 'semantic-ui-react'
import logo from 'resources/logo.png'
const Thanks = ({visible, animationDuration, mobile }) => (
    <Transition visible={visible} animation='scale' duration={animationDuration}>
      <Container text
                 style={{
                   textAlign: 'center',
                   marginTop: mobile ? '1.5em' : '3em',
                   marginBottom: '2em'
                 }}>
        <Grid centered columns={4}>
          <Grid.Column>
            <Image src={logo}/>
          </Grid.Column>
        </Grid>
        <Header
            as='h1'
            content='Thanks And Welcome to The Wilder Community!'
            inverted
            style={{
              fontSize: mobile ? '2em' : '4em',
              fontWeight: 'normal',
              marginBottom: '1em',
            }}
        />
        <Header
            as='h2'
            content='As a member, you will have access to community resources,
            take part and start community initiatives, and enjoy all the perks that come with being a member.
            You should be expecting a verification email for your Wilder Garten digital account. One of the community leaders
            will reach out to you to make sure that you are settled and have everthing you need to get started in
            the community :)'
            inverted
            style={{
              fontSize: '1em',
              fontWeight: 'normal',
              marginBottom: '1em',
            }}
        />
      </Container>
    </Transition>
);

export default Thanks