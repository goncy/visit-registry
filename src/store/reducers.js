import { combineReducers } from 'redux'

import context from './context'
import consortium from './consortium'
import error from './error'
import user from './user'

const rootReducer = toolsReducers => combineReducers({
  ...toolsReducers,
  [context.constants.NAMESPACE]: context.reducer,
  [consortium.constants.NAMESPACE]: consortium.reducer,
  [error.constants.NAMESPACE]: error.reducer,
  [user.constants.NAMESPACE]: user.reducer
})

export default rootReducer
