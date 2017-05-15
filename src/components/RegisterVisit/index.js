import React from 'react'
import { compose, withProps, withHandlers } from 'recompose'
import { connect } from 'react-redux'
import { gql, withApollo } from 'react-apollo'

import withStatus from '../../hocs/withStatus'
import loadable from '../../hocs/loadable'
import dontRender from '../../hocs/dontRender'

import notify from '../../utils/notification'
import scanner from '../../store/scanner'
import { LastVisitsQuery } from '../LastVisits'

import { getDistance } from './selectors'

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

export const RegisterVisitMutation = gql`
  mutation ($consortiumId:ID!, $userId:ID!){
    visit: createVisit(consortiumId:$consortiumId, userId:$userId) {
      id
      createdAt
      consortium {
        name
      }
    }
  }
`

export const RegisterVisitHOC = compose(
  withApollo,
  withStatus,
  connect(
    ({ scanner, user, ...state }) => ({
      scannerStatus: setScan.getStatus(state),
      userLocation: user.location,
      userProfile: user.profile,
      scannerItem: scanner.selected
    })
  ),
  loadable(({ scannerStatus, loading }) => scannerStatus === 'pending' || loading),
  dontRender(({ userLocation, scannerItem }) => !userLocation || !scannerItem),
  withHandlers({
    addVisit: ({ client, userProfile, scannerItem }) => () => client.mutate({
      mutation: RegisterVisitMutation,
      variables: {
        userId: userProfile.id,
        consortiumId: scannerItem.id
      },
      update: (store, { data: { visit } }) => {
        const data = store.readQuery({ query: LastVisitsQuery })
        data.user.visits.push(visit)
        store.writeQuery({ query: LastVisitsQuery, data })
      }
    }),
    registerSuccess: ({ setLoading }) => () => {
      setLoading(false)
      notify('La visita se registro correctamente')
    },
    registerFailure: ({ setLoading }) => () => {
      setLoading(false)
      notify('Hubo un error registrando la visita')
    }
  }),
  withHandlers({
    handleRegisterVisit: ({ setLoading, addVisit, registerSuccess, registerFailure }) => () => {
      setLoading(true)
      return addVisit()
        .then(registerSuccess)
        .catch(registerFailure)
    }
  }),
  withHandlers({
    registerVisit: ({ handleRegisterVisit }) => event => {
      event.preventDefault()
      handleRegisterVisit()
    }
  }),
  withProps(({ userLocation, scannerItem }) => {
    const distance = getDistance(userLocation, scannerItem.location)
    return {
      distance,
      canRegister: distance < 500
    }
  })
)

export default RegisterVisitHOC(RegisterVisit)
