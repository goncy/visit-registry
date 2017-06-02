import React from 'react'
import { compose } from 'recompose'
import { HashRouter as Router, Switch, Route } from 'react-router-dom'

import Header from '../Header'
import RegisterVisit from '../../scenes/RegisterVisit'
import LastVisits from '../../scenes/LastVisits'

import './App.css'

export const App = () => (
  <Router>
    <div className='App'>
      <Header />
      <div className='body pa2 pa4-ns'>
        <Switch>
          <Route exact path='/' component={RegisterVisit} />
          <Route exact path='/visitas' component={LastVisits} />
        </Switch>
      </div>
    </div>
  </Router>
)

export const AppHOC = compose()

export default AppHOC(App)
