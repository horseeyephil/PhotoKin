import React from 'react'
import PropTypes from 'prop-types'
import {connect} from 'react-redux'
import {Link, Route, Switch, withRouter} from 'react-router-dom'
import {logout} from '../store'
import UserSelector from './userSelector.jsx'
import Drawer from './drawer.jsx'
import styles from './componentStyles/nav.css'
import {Login, Signup} from './'
import Title from './userHeading'

const Navbar = ({ handleClick, isLoggedIn, location }) => {
  return (
  <div className = {styles.nav}>
    <Title username={location.pathname.split('/')[2]}/>
    <Drawer switch={styles.switchButton} root={styles.navTool} viewClass={styles.panel} openClass={styles.panelOpen} closedClass={styles.panelClosed}>
      {isLoggedIn ? (
        <div>
          <Link to="/home">Home</Link>
          <a href="#" onClick={handleClick}>
            Logout
          </a>
        </div>
      ) : (
        <div>
          <Link to="/login">Login</Link>
          <Link to="/signup">Sign Up</Link>
          <Switch>
            <Route path="/login" component={Login} />
            <Route path="/signup" component={Signup} />
          </Switch>
        </div>
      )}
    </Drawer>
    <UserSelector />
  </div>
)}

/**
 * CONTAINER
 */
const mapState = state => {
  return {
    isLoggedIn: !!state.user.id,
    name: state.user.firstName,
  }
}

const mapDispatch = dispatch => {
  return {
    handleClick() {
      dispatch(logout())
    }
  }
}

export default withRouter(connect(mapState, mapDispatch)(Navbar))

/**
 * PROP TYPES
 */
Navbar.propTypes = {
  handleClick: PropTypes.func.isRequired,
  isLoggedIn: PropTypes.bool.isRequired
}
