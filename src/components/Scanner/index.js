import React from 'react'
import { compose, withHandlers } from 'recompose'
import { gql, withApollo } from 'react-apollo'
import { connect } from 'react-redux'

import scanner from '../../store/scanner'

const { actions: { setScan } } = scanner

export const Scanner = ({ scan }) => (
  <div>
    <button onClick={() => scan('http://ciudad.gov.ar/ascensores/1234')}>
      Simular escaneo de Chiclana 100 (http://ciudad.gov.ar/ascensores/1234)
    </button>
    <button onClick={() => scan('http://ciudad.gov.ar/ascensores/12345')}>
      Simular escaneo de Rivadavia 1 (http://ciudad.gov.ar/ascensores/12345)
    </button>
    <button onClick={() => scan('http://ciudad.gov.ar/ascensores/123456')}>
      Simular escaneo de Caseros 754 (http://ciudad.gov.ar/ascensores/123456)
    </button>
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
    handleScanSuccess: ({ setScan }) => ({ data: { consortium } }) => {
      if (consortium && consortium.length === 1) {
        setScan(consortium[0])
      }
    },
    handleScanFailure: ({ unsetScan }) => unsetScan
  }),
  withHandlers({
    scan: ({ client, handleScanSuccess, handleScanFailure, startScan }) => url => {
      startScan()
      client.query({
        query: ScannerQuery,
        variables: {
          url
        }
      })
      .then(handleScanSuccess)
      .catch(handleScanFailure)
    }
  })
)

export default ScannerHOC(Scanner)
