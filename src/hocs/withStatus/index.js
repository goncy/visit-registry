import { withState } from 'recompose'

export default withState(
  'loading',
  'setLoading',
  false
)
