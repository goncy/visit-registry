import React from 'react'
import { connect } from 'react-redux'
import { compose } from 'recompose'

import consortium from '../../../../store/consortium'

const { actions: { visitCreated } } = consortium

export const Status = ({ visitCreatedStatus, nextStep }) => {
  if (visitCreatedStatus === 'success') {
    return (
      <div>
        <article className='mw6 center message is-success'>
          <div className='message-body'>
            La visita se registro correctamente
          </div>
        </article>
        <a
          className='button'
          onClick={nextStep}
        >
          <span>Volver al inicio</span>
        </a>
      </div>
    )
  } else if (visitCreatedStatus === 'failure') {
    return (
      <div>
        <article className='mw6 center message is-warning'>
          <div className='message-body'>
            Hubo un error registrando la visita
          </div>
        </article>
        <a
          className='button'
          onClick={nextStep}
        >
          <span>Volver al inicio</span>
        </a>
      </div>
    )
  }

  return null
}

export const StatusHOC = compose(
  connect(
    state => ({
      visitCreatedStatus: visitCreated.getStatus(state)
    })
  )
)

Status.propTypes = {
  visitCreatedStatus: React.PropTypes.string,
  nextStep: React.PropTypes.func
}

export default StatusHOC(Status)
