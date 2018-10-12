import React, { Component } from 'react'
import { Form, Button, Grid, Header, Image, Message, Segment,
    Transition, Container, Label, Dimmer, Loader} from 'semantic-ui-react'
import {StripeProvider} from 'react-stripe-elements';
import {Elements} from 'react-stripe-elements'
import logo from 'resources/logo.png'
import {registerUser} from 'utils/Auth0'
import Submit from './submit'

class Register extends Component {


    constructor(props) {
        super(props);
        this.state = {
            accessCodeValue: null,
            firstname: '',
            lastname:'',
            email: '',
            phone: '',
            password: '',
            firstnameError: false,
            firstnameErrorMessage: '',
            lastnameError: false,
            lastnameErrorMessage: '',
            emailError: false,
            emailErrorMessage: '',
            phoneError: false,
            phoneErrorMessage: '',
            validCC: false,
            loadingText: 'Processing your payment',
            loading: false
        }

        this.validateFirstname = this.validateFirstname.bind(this)
        this.validateLastname = this.validateLastname.bind(this)
        this.validateEmail = this.validateEmail.bind(this)
        this.validatePhone = this.validatePhone.bind(this)
        this.validatePassword = this.validatePassword.bind(this)
        this.clearErrorMessage = this.clearErrorMessage.bind(this)
        this.initLoading = this.initLoading.bind(this)
        this.registerUser = this.registerUser.bind(this)
        this.changeLoadingText = this.changeLoadingText.bind(this)
        this.clearLoading = this.clearLoading.bind(this)

    }


    isEmpty(string) {
        return string == ''
    }

    initLoading() {
        this.setState({loading:true})
    }

    clearLoading() {
        this.setState({loading:false})
    }

    changeLoadingText(text) {
        this.setState({loadingText:text})
    }

    handleInputChange = (event) => {
        let stateObj = {}
        stateObj[event.target.name] = event.target.value
        this.setState(stateObj)
    }

    stripeElementChange = (element) => {
        if (!element.empty && element.complete) {
            this.setState({validCC: true})
        } else {
            this.setState({validCC: false})
        }
    }

    clearErrorMessage(nameKey, messageKey) {
        this.setState({
            [nameKey]: false,
            [messageKey]: ''
        })
    }

    validateFirstname() {
        const { firstname } = this.state
        this.clearErrorMessage('firstnameError', 'firstnameErrorMessage')
        if(!firstname || firstname == '') {
            this.setState({
                firstnameError: true,
                firstnameErrorMessage: 'First Name is required'
            })
        }
    }

    validateLastname() {

        const { lastname } = this.state
        this.clearErrorMessage('lastnameError', 'lastnameErrorMessage')
        if(!lastname || lastname == '') {
            this.setState({
                lastnameError: true,
                lastnameErrorMessage: 'Last Name is required'
            })
        }

    }

    validateEmail() {
        const { email } = this.state
        this.clearErrorMessage('emailError', 'emailErrorMessage')
        var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        if(!re.test(String(email).toLowerCase())) {
            this.setState({
                emailError: true,
                emailErrorMessage: 'Invalid Email'
            })
        }

        if(!email || email == '') {
            this.setState({
                emailError: true,
                emailMessageError: 'Email is required'
            })
        }

    }

    validatePhone() {
        this.clearErrorMessage('phoneError', 'phoneErrorMessage')
        const { phone } = this.state
        if(!phone || phone == '') {
            this.setState({
                phoneError: true,
                phoneErrorMessage: 'Phone number is required'
            })
        }

    }

    validatePassword() {
        const { password } = this.state
        this.clearErrorMessage('passwordError', 'passwordErrorMessage')
        if(password.length < 8 || !password) {
            this.setState({
                passwordError: true,
                passwordErrorMessage: 'Password must be longer than 8 characters'
            })
        }




    }

    registerUser() {
        const { onProcessed } = this.props
        const self = this
        this.setState({loadingText:'Creating your Wilder Garten Profile'})
        return registerUser(this.state)
    }


    render(){
        const {onClick, visible, animationDuration,mobile} = this.props
        const { firstname, lastname, email, phone, password, validCC,
            firstnameError, lastnameError, emailError, phoneError, passwordError, loadingText} = this.state
        const errorLabel = <Label color="red" pointing="left"/>;
        return (
            <div>
            <Transition visible={this.state.loading} animation='fade' duration={animationDuration}>
                <Dimmer active={this.state.loading}>
                    <Loader size='large'>{loadingText}</Loader>
                </Dimmer>
            </Transition>
            <Transition visible={visible} animation='scale' duration={animationDuration}>

                <Container style={{marginTop: mobile ? '1.5em' : '3em',}}>
                    <Grid textAlign='center' style={{ height: '100%' }} verticalAlign='middle'>
                        <Grid.Column style={{ maxWidth: 450 }}>
                            <Form size='large'>
                                <Segment stacked>
                                    <Grid centered columns={4} style={{margin:'0px 10px'}}>
                                        <Grid.Column>
                                            <Image src={logo}/>
                                        </Grid.Column>
                                    </Grid>
                                    <Grid columns={2}>
                                        <Grid.Column>
                                            <Form.Input
                                                size="big"
                                                fluid
                                                error={this.state.firstnameError}
                                                icon='user'
                                                name="firstname"
                                                value={ firstname }
                                                onChange={this.handleInputChange}
                                                iconPosition='left'
                                                placeholder='First Name'
                                                onBlur={this.validateFirstname}

                                            />
                                            <div className="validationMessage">{this.state.firstnameErrorMessage}</div>
                                        </Grid.Column>
                                        <Grid.Column>
                                            <Form.Input
                                                size="big"
                                                fluid
                                                error={this.state.lastnameError}
                                                icon='user'
                                                name="lastname"
                                                value={ lastname }
                                                onChange={this.handleInputChange}
                                                iconPosition='left'
                                                placeholder='Last Name'
                                                onBlur={this.validateLastname}

                                            />
                                            <div className="validationMessage">{this.state.lastnameErrorMessage}</div>
                                        </Grid.Column>
                                    </Grid>


                                    <Form.Input
                                        name="email"
                                        size="big"
                                        fluid
                                        icon='envelope'
                                        value= {email}
                                        iconPosition='left'
                                        onChange={this.handleInputChange}
                                        onBlur={this.validateEmail}
                                        error={this.state.emailError}
                                        placeholder='E-mail address' />
                                    <div className="validationMessage">{this.state.emailErrorMessage}</div>
                                    <Form.Input
                                        name="phone"
                                        size="big"
                                        fluid
                                        icon='phone'
                                        value={phone}
                                        onChange={this.handleInputChange}
                                        iconPosition='left'
                                        onBlur={this.validatePhone}
                                        error={this.state.phoneError}
                                        placeholder='Phone Number' />
                                    <div className="validationMessage">{this.state.phoneErrorMessage}</div>
                                    <Form.Input
                                        fluid
                                        name="password"
                                        icon='lock'
                                        iconPosition='left'
                                        onChange={(event) => {this.handleInputChange(event);this.validatePassword()}}
                                        placeholder='Desired Password'
                                        type='password'
                                        size="big"
                                        onBlur={this.validatePassword}
                                        error={this.state.passwordError}
                                    />
                                    <div className="validationMessage">{this.state.passwordErrorMessage}</div>
                                    <StripeProvider apiKey="pk_test_UPEueEEYg8MWSoDJB8woTAIU">
                                        <Elements>
                                            <Submit
                                                onChange={(element) => this.stripeElementChange(element)}
                                                initLoading={this.initLoading}
                                                registerUser={this.registerUser}
                                                onProcessed={this.props.onProcessed}
                                                firstname={firstname}
                                                lastname={lastname}
                                                clearLoading={this.clearLoading}
                                                email={email}
                                                changeLoadingText={this.changeLoadingText}
                                                disabled={
                                                    !validCC ||
                                                    firstnameError ||
                                                    lastnameError ||
                                                    emailError ||
                                                    phoneError ||
                                                    passwordError ||
                                                    this.isEmpty(firstname) ||
                                                    this.isEmpty(lastname) ||
                                                    this.isEmpty(email) ||
                                                    this.isEmpty(phone) ||
                                                    this.isEmpty(password)
                                                }

                                            />
                                        </Elements>
                                    </StripeProvider>

                                </Segment>
                            </Form>
                            <Message style={{textAlign:'left'}} info>
                                By confirming You will be charged 5€ and billed each subsequent month.
                                You may cancel your membership at any time.
                            </Message>
                        </Grid.Column>
                    </Grid>
                </Container>
            </Transition>
            </div>
        )
    }
}


export default Register