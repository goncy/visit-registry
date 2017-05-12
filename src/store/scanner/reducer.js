import R from 'ramda'

import { clearScan, setScan } from './actions'

const defaultState = {
  selected: null
}

const user = (state = defaultState, {type, payload}) => {
  switch (type) {
    case clearScan.type:
    case setScan.FAILURE:
      return defaultState
    case setScan.SUCCESS:
      return R.assoc('selected', payload)(state)
    default:
      return state
  }
}

export default user
