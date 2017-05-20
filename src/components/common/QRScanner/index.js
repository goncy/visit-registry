import React, { Component } from 'react'
import QRReader from 'react-qr-reader'

class QRScanner extends Component {
  openImageDialog = () => {
    this.refs.reader.openImageDialog()
  }

  submit = event => {
    event.preventDefault()
    const { code: { value: code } } = event.target
    const { onScan } = this.props

    onScan(code)
  }

  render () {
    const {onScan, onError} = this.props

    return (
      <div className='flex flex-column items-center justify-center'>
        <QRReader
          className='mb3'
          ref='reader'
          delay={100}
          style={{
            maxWeight: 240,
            maxWidth: 320
          }}
          onError={onError}
          onScan={onScan}
          legacyMode
        />
        <form
          className='mw6 w-100 mb3'
          onSubmit={this.submit}
        >
          <div className='cf'>
            <input className='f6 f5-l input-reset bn fl black-80 bg-white pa3 lh-solid w-100 w-75-m w-80-l br2-ns br--left-ns' placeholder='Codigo manual' type='text' name='code' />
            <input className='f6 f5-l button-reset fl pv3 tc bn bg-animate bg-black hover-bg-black-70 white pointer w-100 w-25-m w-20-l br2-ns br--right-ns' type='submit' value='Enviar' />
          </div>
        </form>
        <button
          onClick={this.openImageDialog}
          className='b ph3 pv2 input-reset ba b--black bg-transparent grow pointer f6 dib'
        >
          <i className='fa fa-search' />
          <span className='pl1'>Escanear QR</span>
        </button>
      </div>
    )
  }
}

QRScanner.propTypes = {
  onScan: React.PropTypes.func,
  onError: React.PropTypes.func
}

export default QRScanner
