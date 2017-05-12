import { createStore, compose, applyMiddleware } from 'redux'
import { reducer as async } from 'async-action-creator'

import rootReducer from '../store/reducers'

export default function configureStore (apolloClient) {
  // Middlewares
  const apolloMiddleware = applyMiddleware(apolloClient.middleware())
  const reduxMiddleware = (typeof window.__REDUX_DEVTOOLS_EXTENSION__ !== 'undefined') ? window.__REDUX_DEVTOOLS_EXTENSION__() : f => f
  const middlewares = compose(
    apolloMiddleware,
    reduxMiddleware
  )

  // Reducer
  const reducer = rootReducer({
    apollo: apolloClient.reducer(),
    async
  })

  // Return store
  return createStore(
    reducer,
    {},
    middlewares
  )
}
