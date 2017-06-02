import React from 'react'
import { compose, withProps, withHandlers } from 'recompose'
import { connect } from 'react-redux'
import { gql, withApollo } from 'react-apollo'

import loadable from '../../../../hocs/loadable'
import dontRender from '../../../../hocs/dontRender'

import notify from '../../../../utils/notification'
import consortium from '../../../../store/consortium'
import { LastVisitsQuery } from '../../../LastVisits'

import { getDistance } from './selectors'

const { actions: { consortiumSet, visitCreated } } = consortium

export const Register = ({ selectedConsortium, canRegister, distance, createVisit, previousStep }) => {
  if (canRegister) {
    return (
      <div>
        <h1 className='title'>
          {selectedConsortium.name}
        </h1>
        <a
          className='button is-large is-primary is-outlined'
          onClick={createVisit}
        >
          <span className='icon is-medium'>
            <i className='fa fa-map-marker' />
          </span>
          <span>Registrar visita</span>
        </a>
        <br />
        <a
          className='button mt3'
          onClick={previousStep}
        >
          <span>Volver atras</span>
        </a>
      </div>
    )
  } else {
    return (
      <article className='mw6 center message is-warning'>
        <div className='message-body'>
          No se puede registrar la visita, se encuentra muy lejos del consorcio {selectedConsortium.name} ({distance} metros)
        </div>
      </article>
    )
  }
}

Register.propTypes = {
  canRegister: React.PropTypes.bool,
  createVisit: React.PropTypes.func,
  previousStep: React.PropTypes.func,
  distance: React.PropTypes.number,
  selectedConsortium: React.PropTypes.shape({
    id: React.PropTypes.string.isRequired,
    name: React.PropTypes.string.isRequired,
    location: React.PropTypes.shape({
      lat: React.PropTypes.number.isRequired,
      lng: React.PropTypes.number.isRequired
    })
  })
}

export const RegisterMutation = gql`
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

export const RegisterHOC = compose(
  withApollo,
  connect(
    ({ consortium, user, ...state }) => ({
      searchConsortiumStatus: consortiumSet.getStatus(state),
      visitCreatedStatus: visitCreated.getStatus(state),
      userLocation: user.location,
      userProfile: user.profile,
      selectedConsortium: consortium.selected
    }), {
      visitCreatedStart: visitCreated.start,
      visitCreatedSuccess: visitCreated.success,
      visitCreatedFailure: visitCreated.failure
    }
  ),
  loadable(({ searchConsortiumStatus, visitCreatedStatus }) => searchConsortiumStatus === 'pending' || visitCreatedStatus === 'pending'),
  dontRender(({ userLocation, selectedConsortium }) => !userLocation || !selectedConsortium),
  withHandlers({
    createVisitMutation: ({ client, userProfile, selectedConsortium }) => () => client.mutate({
      mutation: RegisterMutation,
      variables: {
        userId: userProfile.id,
        consortiumId: selectedConsortium.id
      },
      update: (store, { data: { visit } }) => {
        const data = store.readQuery({ query: LastVisitsQuery })
        data.user.visits.push(visit)
        store.writeQuery({ query: LastVisitsQuery, data })
      }
    }),
    createVisitSuccess: ({ visitCreatedSuccess }) => () => {
      visitCreatedSuccess()
      notify('La visita se registro correctamente')
    },
    createVisitFailure: ({ visitCreatedFailure }) => () => {
      visitCreatedFailure()
      notify('Hubo un error registrando la visita')
    }
  }),
  withHandlers({
    handleCreateVisit: ({ createVisitMutation, createVisitSuccess, createVisitFailure, visitCreatedStart, nextStep }) => () => {
      visitCreatedStart()
      return createVisitMutation()
        .then(createVisitSuccess)
        .then(nextStep)
        .catch(createVisitFailure)
    }
  }),
  withHandlers({
    createVisit: ({ handleCreateVisit }) => event => {
      event.preventDefault()
      handleCreateVisit()
    }
  }),
  withProps(({ userLocation, selectedConsortium }) => {
    const distance = getDistance(userLocation, selectedConsortium.location)
    return {
      distance,
      canRegister: distance < 500
    }
  })
)

export default RegisterHOC(Register)
