import React, { Component } from 'react';
import ThanksPage from 'modules/Thanks';
import Landing from 'modules/Landing';
import './App.css';
import RegisterForm from './modules/Register';


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
    };
  }

  onSuccessfulAccess() {
    this.setState({
      landingVisible: false,
    });
    const self = this;

    setTimeout(() => {
      window.scrollTo(0, 0);
      self.setState({
        registerVisible: true,
      });
    }, this.state.animationDuration);
  }

  showThanks() {
    const { animationDuration } = this.state;
    const self = this;
    this.setState({ registerVisible: false });
    setTimeout(() => {
      window.scrollTo(0, 0);
      self.setState({
        thanksVisible: true,
      });
    }, animationDuration);
  }


  render() {
    const {
      landingVisible, registerVisible, thanksVisible, animationDuration,
    } = this.state;

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
