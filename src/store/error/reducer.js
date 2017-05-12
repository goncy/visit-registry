// @flow

import notify from '../../utils/notification'

import { isError, isNotification } from './selectors'

type standardAction = {
  type: string,
  payload?: any
}

export type errorReducerType = {}

/**
 * Creates the action creator reducer
 * @param {object} initial state
 * @param {object} action
 * @return {object} new state
 */
const errorReducer = (state: errorReducerType = {}, action: standardAction): errorReducerType => {
  if (isError(action) && isNotification(action)) {
    notify(action.payload.message)
  }

  return state
}

export default errorReducer
