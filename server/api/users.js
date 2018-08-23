const router = require('express').Router()
const {User} = require('../db/models')
const Chats = require('../db/models/chats')
module.exports = router

const verifyUser = (req,res,next)=>{
  if(req.isAuthenticated()) {
    console.log('YOUR IN')
    return next()
  }
  const error = new Error('forbiddden!')
  error.status=403
  next(error)

}
router.get('/', (req, res, next) => {

  //if(!req.user.isAdmin) return res.sendStatus(403)

  User.findAll({
    // explicitly select only the id and email fields - even though
    // users' passwords are encrypted, it won't help if we just
    // send everything to anyone who asks!
    attributes: ['id', 'email', 'firstName', 'lastName']
  })
    .then(users => res.json(users))
    .catch(next)
})

router.use(verifyUser)


router.get('/getChats', (req,res,next)=>{
  Chats.findAll({where:{userId: req.user.id}}).then(chats=>res.json(chats))
})

router.post('/newChat', (req, res, next)=>{
  Chats.create({conversation:req.body.conversation, userId: req.body.userId }).then(freshChat=>res.json(freshChat))
  
})

