import {branch, renderComponent} from 'recompose'

import Spinner from '../../components/common/Spinner'

export default (selector, component) => branch(
  selector,
  renderComponent(component || Spinner)
)
