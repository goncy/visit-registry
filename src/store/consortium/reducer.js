import R from 'ramda'

import { consortiumSet } from './actions'

const defaultState = {
  selected: null
}

const user = (state = defaultState, {type, payload}) => {
  switch (type) {
    case consortiumSet.FAILURE:
      return R.assoc('selected', null)(state)
    case consortiumSet.SUCCESS:
      return R.assoc('selected', payload)(state)
    default:
      return state
  }
}

export default user
