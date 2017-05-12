import React from 'react'
import { compose } from 'recompose'

import HeaderBlock from './blocks/HeaderBlock'
import ScannerBlock from './blocks/ScannerBlock'
import LastVisitsBlock from './blocks/LastVisitsBlock'
import RegisterVisitBlock from './blocks/RegisterVisitBlock'

import './App.css'

export const App = () => (
  <div>
    <div className='App'>
      <HeaderBlock />
      <div className='body pa2 pa4-ns'>
        <RegisterVisitBlock />
        <ScannerBlock />
        <LastVisitsBlock />
      </div>
    </div>
  </div>
)

export const AppHOC = compose()

export default AppHOC(App)
