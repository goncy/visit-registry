import React from 'react'
import { compose, withHandlers } from 'recompose'
import { gql, withApollo } from 'react-apollo'
import { connect } from 'react-redux'

import notify from '../../utils/notification'

import QRScanner from '../common/QRScanner'

import scanner from '../../store/scanner'

const { actions: { setScan } } = scanner

export const Scanner = ({ scan }) => (
  <div>
    <QRScanner
      onScan={scan}
      onError={notify}
    />
  </div>
)

Scanner.propTypes = {
  scan: React.PropTypes.func.isRequired
}

export const ScannerQuery = gql`
  query ($url: String!) {
    consortium: allConsortiums(filter: {
      content: $url
    }) {
      id
      name
      location
    }
  }
`

export const ScannerHOC = compose(
  withApollo,
  connect(undefined, {
    startScan: setScan.start,
    setScan: setScan.success,
    unsetScan: setScan.failure
  }),
  withHandlers({
    getConsortium: ({ client }) => url => client.query({
      query: ScannerQuery,
      variables: {
        url
      }
    }),
    handleScanSuccess: ({ setScan }) => ({ data: { consortium } }) => {
      if (consortium && consortium.length === 1) {
        setScan(consortium[0])
      }
    },
    handleScanFailure: ({ unsetScan }) => (e) => {
      unsetScan()
      notify('Hubo un error obteniendo la informacion del consorcio, por favor, intente nuevamente mas tarde')
    }
  }),
  withHandlers({
    scan: ({ startScan, getConsortium, handleScanSuccess, handleScanFailure }) => url => {
      startScan()
      return getConsortium(url)
        .then(handleScanSuccess)
        .catch(handleScanFailure)
    }
  })
)

export default ScannerHOC(Scanner)
