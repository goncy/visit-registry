import {branch, renderComponent} from 'recompose'

import Spinner from '../../components/common/Spinner'

export default selector => branch(
  selector,
  renderComponent(Spinner)
)
