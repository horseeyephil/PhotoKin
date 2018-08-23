import React from 'react'
import {Link} from 'react-router-dom'
import {connect} from 'react-redux'

const UserSelector = props => (
    <div>
        {props.everyUser.map(eachUser=>(
            <Link to={`/library/${eachUser.id}`}>{eachUser.firstName}</Link>
        ))}
    </div>
)

const mapProps = state => ({everyUser: state.myUsers})
export default connect(mapProps)(UserSelector) 