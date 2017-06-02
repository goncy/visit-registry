import React from 'react'

import Spinner from '../Spinner'

const Loader = () => (
  <section className='hero is-white is-fullheight'>
    <div className='hero-body'>
      <div className='container'>
        <div className='measure center'>
          <Spinner />
        </div>
      </div>
    </div>
  </section>
)

export default Loader
