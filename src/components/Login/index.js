import React from 'react'
import { connect } from 'react-redux'
import { compose, withHandlers, withState } from 'recompose'
import { gql, withApollo } from 'react-apollo'

import notify from '../../utils/notification'

import Loader from '../common/Loader'
import branchable from '../../hocs/branchable'

import user from '../../store/user'

import logo from '../../assets/logo.png'

const { actions: { loggedIn, profileSet, tokenSet } } = user

export const Login = ({ login }) => (
  <section className='hero is-primary is-fullheight'>
    <div className='hero-body'>
      <div className='container'>
        <div className='box measure center'>
          <figure className='image center mw5 pb4 pt2'>
            <img src={logo} alt='logo' />
          </figure>
          <form
            onSubmit={login}
            className='measure center'
          >
            <div className='field'>
              <p className='control'>
                <input
                  className='input is-large'
                  name='email'
                  type='email'
                  placeholder='Contraseña'
                />
              </p>
            </div>

            <div className='field'>
              <p className='control'>
                <input
                  className='input is-large'
                  name='password'
                  type='password'
                  placeholder='Contraseña'
                />
              </p>
            </div>

            <div className='field'>
              <p className='control'>
                <button className='button is-primary is-large w-100'>Iniciar sesion</button>
              </p>
            </div>
          </form>
        </div>
      </div>
    </div>
  </section>
)

Login.propTypes = {
  login: React.PropTypes.func.isRequired
}

export const LoginMutation = gql`
  mutation login($email: String!, $password: String!) {
    userLogin: signinUser(email:{
      email: $email,
      password: $password
    }) {
      token
    }
  }
`

export const ProfileQuery = gql`
  query {
    user {
      id
      email
      name
      visits {
        id
        createdAt
        consortium {
          name
        }
      }
    }
  }
`

export const LoginHOC = compose(
  withApollo,
  withState(
    'logging',
    'setLogging',
    false
  ),
  connect(undefined, {
    logIn: loggedIn.success,
    setToken: tokenSet.success,
    setProfile: profileSet.success
  }),
  withHandlers({
    getToken: ({ client }) => (email, password) => client.mutate({
      mutation: LoginMutation,
      variables: {
        email: email,
        password: password
      }
    }),
    saveToken: ({ setToken }) => ({ data: { userLogin } }) => {
      localStorage.setItem('token', userLogin.token)
      setToken(userLogin.token)
    },
    getProfile: ({ client }) => () => client.query({
      query: ProfileQuery
    }),
    saveProfile: ({ setProfile }) => ({ data: { user } }) => setProfile(user),
    handleLoginSuccess: ({ setLogging, logIn }) => () => {
      setLogging(false)
      logIn()
    },
    handleLoginFailure: ({ setLogging, loginFailed }) => res => {
      setLogging(false)
      notify('Hubo un error iniciando sesion, verifique los datos')
    }
  }),
  withHandlers({
    handleLogin: ({ setLogging, getToken, saveToken, getProfile, saveProfile, handleLoginSuccess, handleLoginFailure }) => (email, password) => {
      setLogging(true)
      return getToken(email, password)
        .then(saveToken)
        .then(getProfile)
        .then(saveProfile)
        .then(handleLoginSuccess)
        .catch(handleLoginFailure)
    }
  }),
  withHandlers({
    login: ({ handleLogin }) => event => {
      event.preventDefault()
      const { email, password } = event.target
      handleLogin(email.value, password.value)
    }
  }),
  branchable(
    ({ logging }) => logging,
    Loader
  )
)

export default LoginHOC(Login)
