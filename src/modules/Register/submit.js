// CheckoutForm.js
import React from 'react';
import { Button } from 'semantic-ui-react';
import { injectStripe, CardElement } from 'react-stripe-elements';
import { subscribe } from 'utils/Stripe';

class Submit extends React.Component {
  constructor(props) {
    super(props);

    this.onSubmit = this.onSubmit.bind(this);
    this.processPayment = this.processPayment.bind(this);
    this.handleError = this.handleError.bind(this);
  }

  async preparePayment() {
    const {firstname, lastname} = this.props

    return this.props.stripe.createSource({
      type: 'card',
      owner: { name: `${firstname} ${lastname}` },
    })
  }

  processPayment(sourceId) {
    const { firstname, lastname, email } = this.props;

    return subscribe({
      firstname, lastname, source: sourceId, email,
    })
  }

  onSubmit() {
    const { initLoading, changeLoadingText, clearLoading, onProcessed, registerUser} = this.props;
    const self = this;
    initLoading();
    changeLoadingText('Preparing Your Payment...');
    this.preparePayment().then(({source}) => {
      changeLoadingText('Processing Your Membership...');
      self.processPayment(source.id).then((response) => {
        changeLoadingText('Creating Your Wilder Garten Profile...');
        registerUser(response.data).then((response) => {
          onProcessed();
          clearLoading();
        }).catch((error) => {
          self.handleRegisterError(error)
        })
      }).catch((error) => {
        self.handleError('There was an error processing your membership, please try again or contact your inviter.')
      })
    }).catch((error) => {
      self.handleError('There was an error preparing your payment, please try again or contact your inviter.');
    })
  }


  handleError(errorMessage) {
  const {clearLoading} = this.props
  alert(errorMessage);
  clearLoading();

}

  handleRegisterError(error) {
    const {clearLoading, onProcessed, changeLoadingText} = this.props;
    let data = {}
    if(error.response) {
       data = error.response.data;
    }

    if (data.code === 'user_exists') {
      changeLoadingText('User profile already exists...skipping creation');
      setTimeout(function() {onProcessed(); clearLoading();}, 500)

    } else {
      alert(`There was an error creating your Wilder Profile. ${data.description}. Please try again or contact your inviter`);
    }
    clearLoading();


  }

  render() {
    const { onChange, disabled } = this.props;


    return (
      <div>
        <CardElement
          onChange={onChange}
          style={{ base: { fontSize: '18px' } }}
        />
        <Button
          onClick={this.onSubmit}
          color="teal"
          fluid
          size="large"
          disabled={disabled}
        >
              Confirm & Join Wilder Garten
        </Button>
      </div>
    );
  }
}

export default injectStripe(Submit);
