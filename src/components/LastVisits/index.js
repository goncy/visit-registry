import React from 'react'
import { mapProps, compose } from 'recompose'
import { gql, graphql } from 'react-apollo'

import loadable from '../../hocs/loadable'

export const LastVisits = ({ visits }) => (
  <div className='measure-wide center'>
    <div className='overflow-auto tl'>
      {!!visits.length && (
        <table className='f6 w-100 mw8 center ba b--black-20' cellSpacing='0'>
          <thead>
            <tr>
              <th className='fw6 bb b--black-20 tl pa3'>Nombre</th>
              <th className='fw6 bb b--black-20 tl pa3'>Fecha</th>
            </tr>
          </thead>
          <tbody className='lh-copy'>
            {visits.map((item, index) => (
              <tr key={index}>
                <td className='pa3 bb b--black-20'>
                  {item.consortium.name}
                </td>
                <td className='pa3 bb b--black-20'>
                  {item.createdAt}
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
        consortium {
          name
        }
        createdAt
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
