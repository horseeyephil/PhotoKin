const axios = require('axios')

const FETCH_USERS_FOR_ADMIN = 'FETCH_USERS_FOR_ADMIN'

const fetchUsers = allUsers => ({type: FETCH_USERS_FOR_ADMIN, allUsers})

export const fetchUsersForAdmin = () => dispatch => {
    axios.get('/api/users').then(res=>res.data).then(allUsers=>dispatch(fetchUsers(allUsers)))
}

export default (users=[],action) => {
    switch(action.type){
        case FETCH_USERS_FOR_ADMIN: return action.allUsers
        default: return users
    }
}