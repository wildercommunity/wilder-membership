// CheckoutForm.js
import React from 'react';
import { Button } from 'semantic-ui-react'
import {injectStripe, CardElement} from 'react-stripe-elements';
import {subscribe} from 'utils/Stripe'

class Submit extends React.Component {
  constructor(props) {
    super(props)

    this.onSubmit = this.onSubmit.bind(this)
    this.processPayment = this.processPayment.bind(this)
  }

  processPayment() {
    const { firstname, lastname, email, changeLoadingText, clearLoading, onProcessed } = this.props
    changeLoadingText('Preparing Your Payment')
    return this.props.stripe.createSource({
      type: 'card',
      owner: {name: `${firstname} ${lastname}`}
    }).then(({source}) => {
      changeLoadingText('Processing Your Membership')
      return subscribe({firstname: firstname, lastname:lastname, source: source.id, email: email})
        .then(function(response) {
            onProcessed();
            clearLoading();
        }).catch(function(error) {
          alert('There was an error processing your membership, please try again or contact your inviter.')
          clearLoading();
        })
    }).catch(function(error) {
      alert('There was an error preparing your payment, please try again or contact your inviter.')
      clearLoading();
    })
  ;
  }

  onSubmit() {
    const { initLoading, changeLoadingText, clearLoading } = this.props;
    const self = this
    initLoading();
    this.props.registerUser()
        .then(function (response) {
          self.processPayment()
        }).catch(function(error) {
          let data = error.response.data
          if (data.code == 'user_exists') {
            changeLoadingText('User profile already exists...skipping creation')
            setTimeout(self.processPayment, 500)
          } else {
            alert(`There was an error creating your Wilder Profile. ${data.description}. Please try again or contact your inviter`)
            clearLoading();
          }
        })
  }


  render() {
    const {onChange, disabled} = this.props



    return (
          <div>
            <CardElement
                onChange={onChange}
                style={{base: {fontSize: '18px'}}} />
            <Button
                onClick={this.onSubmit}
                color='teal'
                fluid size='large'
                disabled={ disabled }
            >
              Confirm & Join Wilder Garten
            </Button>
          </div>
    );
  }

}

  export default injectStripe(Submit);