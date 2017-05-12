import notification from 'node-snackbar'

const ACTION_COLOR = '#FFF'

export default text => notification.show({
  actionTextColor: ACTION_COLOR,
  actionText: 'Cerrar',
  pos: 'top-right',
  text
})
