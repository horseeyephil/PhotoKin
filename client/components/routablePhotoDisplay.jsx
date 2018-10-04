import React from 'react'
import PhotoDisplay from './photoDisplay.jsx'
import { connect } from 'react-redux';

const PhotoRoute = props => {

    const displayUser = props.allUsers.find(eachUser=> +eachUser.id === +props.id)
    return (
    <div>
      <PhotoDisplay displayUser={displayUser} />
      <div id='tail'></div>
    </div>
)}

const mapProps = state => ({allUsers: state.myUsers})

export default connect(mapProps)(PhotoRoute)