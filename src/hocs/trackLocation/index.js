import { compose, lifecycle } from 'recompose'
import { connect } from 'react-redux'

import user from '../../store/user'

const { actions: { locationSet } } = user

export default compose(
  connect(undefined, {
    setLocation: locationSet.success,
    setLocationFailed: locationSet.failure
  }),
  lifecycle({
    componentDidMount () {
      const { setLocation, setLocationFailed } = this.props

      if ('geolocation' in navigator) {
        navigator.geolocation.watchPosition(({ coords }) => {
          setLocation({
            lat: coords.latitude,
            lng: coords.longitude
          })
        })
      } else {
        setLocationFailed('No se pudo obtener la ubicacion, intente nuevamente mas tarde')
      }
    }
  })
)
