import React from 'react'
import { compose } from 'recompose'

import needsAuthorization from '../../hocs/needsAuthorization'
import trackLocation from '../../hocs/trackLocation'

import App from '../App'

export const Root = () => (
  <div className='bg-near-white vh-100'>
    <App />
  </div>
)

export const RootHOC = compose(
  trackLocation,
  needsAuthorization
)

export default RootHOC(Root)
