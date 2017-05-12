import { compose, lifecycle } from 'recompose'
import { connect } from 'react-redux'

import user from '../../store/user'

const { actions: { setLocation } } = user

export default compose(
  connect(undefined, {
    setLocationData: setLocation.success,
    setLocationError: setLocation.failure
  }),
  lifecycle({
    componentDidMount () {
      const { setLocationData, setLocationError } = this.props

      if ('geolocation' in navigator) {
        navigator.geolocation.watchPosition(({ coords }) => {
          setLocationData({
            lat: coords.latitude,
            lng: coords.longitude
          })
        })
      } else {
        setLocationError('No se pudo obtener la ubicacion, intente nuevamente mas tarde')
      }
    }
  })
)
