import React from 'react'
import { compose, withState } from 'recompose'

import Search from './components/Search'
import Register from './components/Register'
import Status from './components/Status'

export const RegisterVisitWizard = ({ step, setStep }) => {
  switch (step) {
    case 1:
      return (
        <Search nextStep={() => setStep(2)} />
      )
    case 2:
      return (
        <Register
          previousStep={() => setStep(1)}
          nextStep={() => setStep(3)}
        />
      )
    case 3:
      return (
        <Status nextStep={() => setStep(1)} />
      )
    default:
      return null
  }
}

RegisterVisitWizard.propTypes = {
  step: React.PropTypes.number,
  setStep: React.PropTypes.func
}

export const RegisterVisitWizardHOC = compose(
  withState(
    'step',
    'setStep',
    1
  )
)

export default RegisterVisitWizardHOC(RegisterVisitWizard)
