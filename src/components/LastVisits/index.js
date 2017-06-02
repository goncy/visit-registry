import React from 'react'
import { mapProps, compose } from 'recompose'
import { gql, graphql } from 'react-apollo'
import moment from 'moment'

import loadable from '../../hocs/loadable'

export const LastVisits = ({ visits }) => (
  <div className='measure-wide center'>
    <div className='overflow-auto tl'>
      {!!visits.length && (
        <table className='table is-bordered is-striped'>
          <thead>
            <tr>
              <th>Consorcio</th>
              <th>Fecha</th>
            </tr>
          </thead>
          <tbody>
            {visits.map((item, index) => (
              <tr key={index}>
                <td>
                  {item.consortium.name}
                </td>
                <td>
                  {moment(item.createdAt).fromNow()}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      {!visits.length && (
        <p className='tc'>
          No hay visitas recientes
        </p>
      )}
    </div>
  </div>
)

LastVisits.propTypes = {
  visits: React.PropTypes.arrayOf(
    React.PropTypes.shape({
      consortium: React.PropTypes.shape({
        name: React.PropTypes.string.isRequired
      }).isRequired,
      createdAt: React.PropTypes.string.isRequired
    }).isRequired
  )
}

export const LastVisitsQuery = gql`
  query {
    user {
      id
      visits {
        id
        createdAt
        consortium {
          name
        }
      }
    }
  }
`

export const LastVisitsHOC = compose(
  graphql(LastVisitsQuery),
  mapProps(({ data }) => ({
    loading: data.loading,
    error: data.error,
    user: data.user
  })),
  loadable(({ loading }) => loading),
  mapProps(({ user }) => ({
    visits: user.visits
  }))
)

export default LastVisitsHOC(LastVisits)
