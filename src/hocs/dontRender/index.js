import {branch, renderNothing} from 'recompose'

export default selector => branch(
  selector,
  renderNothing
)
