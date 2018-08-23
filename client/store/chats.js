const axios = require('axios')

const FETCH_ALL_CHATS = 'FETCH_ALL_CHATS'
const ADD_CHAT = 'ADD_CHAT'

const fetchChatsAction = chats => ({type:FETCH_ALL_CHATS, chats})

const addChat = chat => ({type:ADD_CHAT, chat})

export const fetchChats = () => dispatch => {
    axios.get(`/api/users/getChats`).then(res=>res.data).then(allChats=>dispatch(fetchChatsAction(allChats)))
    .catch(console.error)
}

export const postChat = (conversation, userId) => dispatch => {
    axios.post('/api/users/newChat', {conversation, userId}).then(res=>res.data)
    .then(chat=>dispatch(addChat(chat)))
    .catch(console.error)
}

export default function (chats=[], action){
    switch(action.type){
        case FETCH_ALL_CHATS : return action.chats
        case ADD_CHAT: return [...chats, action.chat]
        default: return chats
    }
}