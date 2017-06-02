import React from 'react'
import { compose, withHandlers } from 'recompose'
import { gql, withApollo } from 'react-apollo'
import { connect } from 'react-redux'

import notify from '../../../../utils/notification'

import loadable from '../../../../hocs/loadable'

import consortium from '../../../../store/consortium'

const { actions: { consortiumSet } } = consortium

export const Search = ({ submit, loading }) => (
  <form
    className='mw6 w-100 center'
    onSubmit={submit}
  >
    <div className='field has-addons'>
      <p className='control is-expanded'>
        <input
          name='code'
          type='number'
          className='input is-large'
          placeholder='Numero de oblea'
        />
      </p>
      <p className='control'>
        <input
          type='submit'
          disabled={loading}
          className='button is-primary is-large'
          value='Enviar'
        />
      </p>
    </div>
  </form>
)

Search.propTypes = {
  submit: React.PropTypes.func.isRequired,
  loading: React.PropTypes.bool.isRequired
}

export const SearchQuery = gql`
  query ($number: Int!) {
    consortium: allConsortiums(filter: {
      number: $number
    }) {
      id
      name
      location
    }
  }
`

export const SearchHOC = compose(
  withApollo,
  connect(state => ({
    loading: consortiumSet.getStatus(state) === 'pending'
  }), {
    searchStarted: consortiumSet.start,
    searchFinishedSuccess: consortiumSet.success,
    searchFinishedFailure: consortiumSet.failure
  }),
  loadable(({ loading }) => loading),
  withHandlers({
    submit: ({ searchStarted, client, nextStep, searchFinishedSuccess, searchFinishedFailure }) => async event => {
      event.preventDefault()
      const { code: { value } } = event.target
      const code = parseInt(value, 10)

      try {
        searchStarted()
        const { data: { consortium } } = await client.query({
          query: SearchQuery,
          variables: {
            number: code
          }
        })

        if (consortium && consortium.length === 1) {
          searchFinishedSuccess(consortium[0])
          nextStep()
        } else {
          searchFinishedFailure()
          notify('No se encontro un consorcio asociado para la oblea asignada')
        }
      } catch (e) {
        searchFinishedFailure()
        notify('Hubo un error obteniendo la informacion del consorcio, por favor, intente nuevamente mas tarde')
      }
    }
  })
)

export default SearchHOC(Search)
