import { compose } from 'recompose'
import { connect } from 'react-redux'

import branchable from '../branchable'

import Login from '../../components/Login'

export default compose(
  connect(
    ({ user }) => ({
      logged: user.logged
    })
  ),
  branchable(
    ({ logged }) => !logged,
    Login
  )
)
