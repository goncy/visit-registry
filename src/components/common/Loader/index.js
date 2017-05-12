import React from 'react'

import Spinner from '../Spinner'

const Loader = () => (
  <div className='vh-100 flex justify-center items-center min-h-100'>
    <Spinner />
  </div>
)

export default Loader
