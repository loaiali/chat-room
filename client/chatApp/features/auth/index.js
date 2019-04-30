import React from 'react'
import { connect } from 'react-redux'
import { logInUser as login } from './authActions'
import { Text, Container, Content, Form, Item, Label, Input, Button, Header } from 'native-base'

class AuthScreen extends React.Component {
  state = {
    username: 'ammar',
    password: 'ammar',
  }

  handleUsernameUpdate = username => {
    this.setState({username})
  }

  handlePasswordUpdate = password => {
    this.setState({password})
  }

  componentWillMount() {
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.token) this.props.navigation.navigate('chatMain')
  }

  _login(){
    console.log(this.state.username, this.state.password)
    this.props.login(this.state.username, this.state.password)
  }

  render() {
    return (
      <Container>
        <Header />
        <Content>
          <Form>
            <Item floatingLabel>
              <Label>Username</Label>
              <Input value={this.state.username} onChangeText={this.handleUsernameUpdate}/>
            </Item>
            <Item floatingLabel last>
              <Label>Password</Label>
              <Input value={this.state.password} onChangeText={this.handlePasswordUpdate}/>
            </Item>
          </Form>
          <Button onPress={() => this._login()}>
            <Text>Log in</Text>
          </Button>
        </Content>
      </Container>
    )
  }
}

const mapStateToProps = state => ({
  token: state.auth.token,
})

const mapDispatchToProps = {
  login,
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(AuthScreen)
