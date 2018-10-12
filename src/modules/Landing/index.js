import React, { Component } from 'react'
import {
    Button,
    Form,
    Grid,
    Header,
    Image,
    Message,
    Segment,
    Transition,
    Input,
    Container,
    Divider,
    Icon,
    List,
    Menu,
    Responsive,
    Sidebar,
} from 'semantic-ui-react'

import logo from 'resources/logo.png'

class Landing extends Component {


  constructor(props) {
    super(props);
    this.checkAccessCode = this.checkAccessCode.bind(this);
    this.state = {
      accessCodeValue: null
    }
  }

  checkAccessCode() {
    const { accessCodeValue } = this.state
    const { onSuccessfulAccess } = this.props
    if(accessCodeValue && accessCodeValue.toUpperCase() == 'SEIDWILD') {
      onSuccessfulAccess();
    } else {
      alert('fail')
    }
  }

  handleKeyPress = (event) => {
    if(event.key == 'Enter'){
      this.checkAccessCode();
    }
  }

  handleChange= e => {
    this.setState({accessCodeValue: e.target.value})
  }

  render() {
    const { mobile, visible, animationDuration } = this.props
    return (
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
              content='Wilder Garten Full Membership'
              inverted
              style={{
                fontSize: mobile ? '2em' : '4em',
                fontWeight: 'normal',
                marginBottom: '1em',
              }}
          />

          <Grid centered >
            <Grid.Column computer={8} mobile={16}>
              <List inverted style = {{ textAlign: 'left'}}>
                <List.Item>
                  <Icon inverted name='check circle' />
                  <List.Content>
                    <List.Header>Free Entry to All Events</List.Header>
                  </List.Content>
                </List.Item>
                <List.Item >
                  <Icon inverted name='check circle' />
                  <List.Content inverted>
                    <List.Header>Access To Community Finances/Resources</List.Header>
                  </List.Content>
                </List.Item>
                <List.Item>
                  <Icon inverted name='check circle' />
                  <List.Content>
                    <List.Header>Free Entry to All Workshops</List.Header>
                  </List.Content>
                </List.Item>
                <List.Item>
                  <Icon inverted name='check circle' />
                  <List.Content>
                    <List.Header>Full Content Access</List.Header>
                  </List.Content>
                </List.Item>
                <List.Item>
                  <Icon inverted name='check circle' />
                  <List.Content>
                    <List.Header>Unlimited Cloud Storage</List.Header>
                    <List.Description>(10€+/Month Value)</List.Description>
                  </List.Content>
                </List.Item>
                <List.Item>
                  <Icon inverted name='check circle' />
                  <List.Content>
                    <List.Header>Meetup.com Pro Account Access </List.Header>
                    <List.Description>(5€/Month Value) </List.Description>
                  </List.Content>
                </List.Item>
                <List.Item>
                  <Icon inverted name='check circle' />
                  <List.Content>
                    <List.Header>Canva.com Pro Account Access</List.Header>
                    <List.Description>(13€/Month Value)</List.Description>
                  </List.Content>
                </List.Item>
                <List.Item>
                  <Icon inverted name='check circle' />
                  <List.Content>
                    <List.Header>Influence in Community Direction</List.Header>
                  </List.Content>
                </List.Item>
                <List.Item >
                  <Icon inverted name='check circle' />
                  <List.Content>
                    <List.Header>Access To Wilder Garten Social Channels</List.Header>
                  </List.Content>
                </List.Item>
                <List.Item>
                  <Icon inverted name='check circle' />
                  <List.Content>
                    <List.Header>Free Quarterly Community Gatherings At Dope Restauraunts</List.Header>
                  </List.Content>
                </List.Item>
                <List.Item>
                  <Icon inverted name='ellipsis horizontal' />
                  <List.Content>
                    <List.Header>And More Perks To Come</List.Header>
                  </List.Content>
                </List.Item>
              </List>
            </Grid.Column>
          </Grid>

          <Header
              as='h2'
              content='5€/Month'
              inverted
              style={{
                fontSize: mobile ? '1em' : '2em',
                fontWeight: 'normal',
                marginBottom: 0,
              }}
          />
          <Header
              as='h3'
              content='Enter an invitation code'
              inverted
              style={{
                fontSize: mobile ? '1.5em' : '1.7em',
                fontWeight: 'normal',
                marginTop: mobile ? '0.5em' : '1em',
              }}
          />
          <Grid centered>
            <Grid.Column computer={8} mobile={16}>
              <Input
                  action={{
                    color: 'teal', icon: 'angle double right', size: 'big', onClick: this.checkAccessCode
                  }}
                  size='huge'
                  fluid
                  className="access-code"
                  placeholder="Access Code"
                  onChange={this.handleChange}
                  onKeyPress={this.handleKeyPress}
              />
            </Grid.Column>
          </Grid>
        </Container>
      </Transition>
    )
  }
}

export default Landing