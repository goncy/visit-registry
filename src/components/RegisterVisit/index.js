import React from 'react'
import { compose, withProps, withHandlers } from 'recompose'
import { connect } from 'react-redux'
import { gql, graphql } from 'react-apollo'

import notify from '../../utils/notification'

import withStatus from '../../hocs/withStatus'
import loadable from '../../hocs/loadable'
import dontRender from '../../hocs/dontRender'

import { getDistance } from './selectors'

import scanner from '../../store/scanner'

const { actions: { setScan } } = scanner

export const RegisterVisit = ({ scannerItem, canRegister, distance, registerVisit }) => {
  if (canRegister) {
    return (
      <button onClick={registerVisit}>
        Registrar visita para {scannerItem.name}
      </button>
    )
  } else {
    return (
      <p>
        No se puede registrar la visita, se encuentra muy lejos del consorcio ({distance} metros)
      </p>
    )
  }
}

RegisterVisit.propTypes = {
  canRegister: React.PropTypes.bool,
  registerVisit: React.PropTypes.func,
  distance: React.PropTypes.number,
  scannerItem: React.PropTypes.shape({
    id: React.PropTypes.string.isRequired,
    name: React.PropTypes.string.isRequired,
    location: React.PropTypes.shape({
      lat: React.PropTypes.number.isRequired,
      lng: React.PropTypes.number.isRequired
    })
  })
}

export const RegisterVisitQuery = gql`
  mutation ($consortiumId:ID!, $userId:ID!){
    createdVisit: createVisit(consortiumId:$consortiumId, userId:$userId) {
      createdAt
    }
  }
`

export const RegisterVisitHOC = compose(
  withStatus,
  connect(
    ({ scanner, user, ...state }) => ({
      scannerStatus: setScan.getStatus(state),
      userLocation: user.location,
      userProfile: user.profile,
      scannerItem: scanner.selected
    })
  ),
  loadable(({ scannerStatus }) => scannerStatus === 'pending'),
  dontRender(({ userLocation, scannerItem }) => !userLocation || !scannerItem),
  withHandlers({
    registerSuccess: ({ login, setLoading }) => ({ data: { createdVisit } }) => {
      setLoading(false)
      notify('La visita se registro correctamente')
    },
    registerFailure: ({ login, setLoading }) => res => {
      setLoading(false)
      notify('Hubo un error registrando la visita')
    }
  }),
  graphql(RegisterVisitQuery),
  withProps(({ userLocation, scannerItem }) => ({
    distance: getDistance(userLocation, scannerItem.location)
  })),
  withProps(({ distance, userProfile, scannerItem, mutate, registerSuccess, registerFailure, setLoading }) => ({
    canRegister: distance < 500,
    registerVisit: () => {
      setLoading(true)
      return mutate({
        variables: {
          userId: userProfile.id,
          consortiumId: scannerItem.id
        }
      })
      .then(registerSuccess)
      .catch(registerFailure)
    }
  }))
)

export default RegisterVisitHOC(RegisterVisit)
