import React from 'react'
import {Link} from 'react-router-dom'
import {connect} from 'react-redux'
import styles from './componentStyles/nav.css'

const UserSelector = props => (
    <div className={styles.users}>
        {props.everyUser.map(eachUser=>(
            <Link to={`/library/${eachUser.id}`}>{eachUser.firstName}</Link>
        ))}
    </div>
)

const mapProps = state => ({everyUser: state.myUsers})
export default connect(mapProps)(UserSelector) 