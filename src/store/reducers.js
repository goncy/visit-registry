import { combineReducers } from 'redux'

import context from './context'
import scanner from './scanner'
import error from './error'
import user from './user'

const rootReducer = toolsReducers => combineReducers({
  ...toolsReducers,
  [context.constants.NAMESPACE]: context.reducer,
  [scanner.constants.NAMESPACE]: scanner.reducer,
  [error.constants.NAMESPACE]: error.reducer,
  [user.constants.NAMESPACE]: user.reducer
})

export default rootReducer
