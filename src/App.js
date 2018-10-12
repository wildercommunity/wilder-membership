import React, { Component } from 'react';
import RegisterForm from './modules/Register'
import ThanksPage from 'modules/Thanks'
import Landing from 'modules/Landing'
import './App.css';
import { Button, Form, Grid, Header, Image, Message, Segment, Loader, Transition, Dimmer } from 'semantic-ui-react'


class App extends Component {

  constructor(props) {
    super(props);
    this.showThanks = this.showThanks.bind(this);
    this.onSuccessfulAccess = this.onSuccessfulAccess.bind(this);
    this.state = {
      landingVisible: true,
      registerVisible: false,
      thanksVisible: false,
      loading: false,
      animationDuration: 600,
      loadingText: 'Creating your Wilder Profile'
    }
  }

  onSuccessfulAccess() {
    this.setState({
      landingVisible: false,
    })
    let self = this

    setTimeout(function(){
      window.scrollTo(0,0);
      self.setState({
        registerVisible: true ,
      })
    }, this.state.animationDuration)
  }

  showThanks() {
    const { animationDuration } = this.state
    let self = this
    console.log('showTanks')
    this.setState({registerVisible: false})
    setTimeout(function(){
      self.setState({
        thanksVisible: true,
      })
    }, animationDuration)

  }


  render() {
    const { landingVisible, registerVisible, thanksVisible, animationDuration, loadingText} = this.state

    return (
        <div>
            <Landing
                visible={landingVisible}
                animationDuration={animationDuration}
                onSuccessfulAccess={this.onSuccessfulAccess}
            />
            <RegisterForm
              onProcessed={this.showThanks}
              visible={registerVisible}
              animationDuration={animationDuration}
            />
            <ThanksPage
              visible={thanksVisible}
              animationDuration={animationDuration}
            />

        </div>

    );
  }
}

export default App;
