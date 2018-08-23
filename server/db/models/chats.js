const Sequelize = require('sequelize')
const db = require('../db')
const User = require('./user')

const Chats = db.define('chats', {
    conversation: {type: Sequelize.TEXT}
})

Chats.belongsTo(User)
Chats.belongsTo(User, {as: 'toRecipient'})

module.exports = Chats