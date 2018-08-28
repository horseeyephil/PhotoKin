import React from 'react'
import PhotoDisplay from './photoDisplay.jsx'
import { connect } from 'react-redux';

const PhotoRoute = props => {

    console.log('match?? ', props.allUsers)
    const displayUser = props.allUsers.find(eachUser=> +eachUser.id === +props.id)
    console.log('Trying to look at', displayUser)

    return <PhotoDisplay displayUser={displayUser} />
}

const mapProps = state => ({allUsers: state.myUsers})

export default connect(mapProps)(PhotoRoute)