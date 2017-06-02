import R from 'ramda'

import { loggedIn, locationSet, profileSet, tokenSet } from './actions'

const defaultState = {
  logged: false,
  profile: null,
  token: null,
  location: null,
  errors: {}
}

const user = (state = defaultState, {type, payload}) => {
  switch (type) {
    case loggedIn.SUCCESS:
      return R.assoc('logged', true)(state)
    case tokenSet.SUCCESS:
      return R.assoc('token', payload)(state)
    case tokenSet.FAILURE:
      return R.assocPath(['errors', 'token'], payload)(state)
    case profileSet.SUCCESS:
      return R.assoc('profile', payload)(state)
    case profileSet.FAILURE:
      return R.assocPath(['errors', 'profile'], payload)(state)
    case locationSet.SUCCESS:
      return R.assoc('location', payload)(state)
    case locationSet.FAILURE:
      return R.assocPath(['errors', 'location'], payload)(state)
    default:
      return state
  }
}

export default user
