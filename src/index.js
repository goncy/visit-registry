import React from 'react'
import ReactDOM from 'react-dom'
import { ApolloProvider } from 'react-apollo'
import moment from 'moment'

import configureStore from './providers/redux'
import configureApolloClient from './providers/apollo'

import Root from './components/Root'

import 'tachyons'
import 'font-awesome/css/font-awesome.css'
import 'node-snackbar/dist/snackbar.css'

import './index.css'

const apolloClient = configureApolloClient()
const store = configureStore(apolloClient)

moment.locale('es')

ReactDOM.render(
  <ApolloProvider
    client={apolloClient}
    store={store}
  >
    <Root />
  </ApolloProvider>,
  document.getElementById('root')
)
