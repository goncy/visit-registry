import React from 'react'
import { connect } from 'react-redux'
import { compose, withHandlers, withState } from 'recompose'
import { gql, withApollo } from 'react-apollo'

import notify from '../../utils/notification'

import Loader from '../common/Loader'
import branchable from '../../hocs/branchable'

import user from '../../store/user'

const { actions: { setLoggedIn, setProfile, setToken } } = user

export const Login = ({ login }) => (
  <div className='bg-near-white vh-100 pa2 pa4-ns'>
    <article className='mw6 center bg-white br3 pa3 pa4-ns ba b--black-10'>
      <form
        onSubmit={login}
        className='measure center'
      >
        <fieldset className='ba b--transparent ph0 mh0'>
          <legend className='f4 fw6 ph0 mh0'>
            Iniciar sesion
          </legend>
          <div className='mt3'>
            <label className='db fw6 lh-copy f6 mb1'>
              Email
            </label>
            <input
              className='pa2 input-reset ba bg-transparent w-100'
              type='email'
              name='email'
            />
          </div>
          <div className='mv3'>
            <label className='db fw6 lh-copy f6 mb1'>
              Contraseña
            </label>
            <input
              className='b pa2 input-reset ba bg-transparent w-100'
              type='password'
              name='password'
            />
          </div>
        </fieldset>
        <div>
          <input
            className='b ph3 pv2 input-reset ba b--black bg-transparent grow pointer f6 dib'
            type='submit'
            value='Enviar'
          />
        </div>
      </form>
    </article>
  </div>
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
    setLoggedIn: setLoggedIn.success,
    setToken: setToken.success,
    setProfile: setProfile.success
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
    handleLoginSuccess: ({ setLogging, setLoggedIn }) => () => {
      setLogging(false)
      setLoggedIn()
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
