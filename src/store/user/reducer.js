import R from 'ramda'

import { setLoggedIn, setLocation, setProfile, setToken } from './actions'

const defaultState = {
  logged: false,
  profile: null,
  token: null,
  location: null,
  errors: {}
}

const user = (state = defaultState, {type, payload}) => {
  switch (type) {
    case setLoggedIn.SUCCESS:
      return R.assoc('logged', true)(state)
    case setToken.SUCCESS:
      return R.assoc('token', payload)(state)
    case setToken.FAILURE:
      return R.assocPath(['errors', 'token'], payload)(state)
    case setProfile.SUCCESS:
      return R.assoc('profile', payload)(state)
    case setProfile.FAILURE:
      return R.assocPath(['errors', 'profile'], payload)(state)
    case setLocation.SUCCESS:
      return R.assoc('location', payload)(state)
    case setLocation.FAILURE:
      return R.assocPath(['errors', 'location'], payload)(state)
    default:
      return state
  }
}

export default user
