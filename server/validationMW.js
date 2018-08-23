function soloValidation(req, res, next){
    if(!req.user || req.user.id!==process.env.VALIDATIONID || req.user.name!==process.env.VALIDATIONNAME){
        const err = new Error('Only the owner can use this app!')
        next(err)
    }
}

module.exports = soloValidation