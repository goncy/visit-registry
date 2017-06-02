import React from 'react'
import { NavLink } from 'react-router-dom'
import { compose, withState } from 'recompose'

import logo from '../../assets/logo.png'

import './Header.css'

export const Header = ({ toggled, setToggled }) => (
  <div className='Header'>
    <nav className='nav has-shadow'>
      <div className='nav-left'>
        <a className='nav-item'>
          <img src={logo} alt='Casa Imaz Logo' />
        </a>
      </div>
      <div className={`nav-right nav-menu ${toggled ? 'is-active' : ''}`}>
        <NavLink
          exact
          to='/'
          activeClassName='is-active'
          className='nav-item is-tab'
        >
          Registrar visita
        </NavLink>
        <NavLink
          exact
          to='/visitas'
          activeClassName='is-active'
          className='nav-item is-tab'
        >
          Ultimas visitas
        </NavLink>
      </div>
      <span
        onClick={() => setToggled(!toggled)}
        className={`nav-toggle ${toggled ? 'is-active' : ''}`}
      >
        <span />
        <span />
        <span />
      </span>
    </nav>
  </div>
)

Header.propTypes = {
  toggled: React.PropTypes.bool,
  setToggled: React.PropTypes.func
}

export const HeaderHOC = compose(
  withState(
    'toggled',
    'setToggled',
    false
  )
)

export default HeaderHOC(Header)
