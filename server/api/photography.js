const router = require('express').Router()
const multer = require('multer')
const storage = multer.memoryStorage()
const upload = multer({ storage })
const fs = require('fs')
const path = require('path')
const soloValidation = require('../validationMW')
const {User} = require('../db/models')

const AWS = require('aws-sdk')

AWS.config.loadFromPath('./awsconfig.json')


// const s3 = new AWS.S3()
const bucketParams = {Bucket: process.env.BUCKETNAME}
// s3.createBucket(bucketParams, function(err, data) {
//     if (err) console.log(err, err.stack); // an error occurred
//     else     console.log(data);           // successful response)
// })
const s3Bucket = new AWS.S3( { params: bucketParams } )

// ------ FORMERLY USING MULTER AND FILE SYSTEM TO STORE PHOTOS ------
// router.get('/library', (req, res, next)=>{
    
//     fs.readdir(path.join(__dirname,'../..','/public/photos'), (err,files)=>{
//         res.json(files)
//     })
// })
// ------ FORMERLY USING MULTER AND FILE SYSTEM TO STORE PHOTOS ------

router.get('/library/:userPage', (req, res, next)=>{

    s3Bucket.listObjects({Prefix: req.params.userPage}, (err, data)=>{

        if(err) res.json(503)

        const bucketContents = data.Contents;

        if(bucketContents.length>0){

            const promisifiedMap = bucketContents.map(content=>{

                const urlParams = {Bucket: process.env.BUCKETNAME, Key: 'thumbnail/' + content.Key, Expires: 3600};

                return new Promise(function(resolve, reject){
                    s3Bucket.getSignedUrl('getObject',urlParams, function(err, url){
                    
                        if(err) reject(err)
                        else{
                          resolve(url)
                        }
                        })
                })
            })

            Promise.all(promisifiedMap).then(url=>{
                    
                    const zipped = url.map((eachUrl, index)=>({signedUrl: eachUrl, key: bucketContents[index].Key}))
                    res.json(zipped)
                })
                .catch(next)
        }
     })
})

router.get('/library/:userPage/:objectKey', (req,res,next)=>{

    console.log('SELECT ', req.params.userPage + '/' + req.params.objectKey)

    s3Bucket.getSignedUrl('getObject', {Bucket: process.env.BUCKETNAME, Key: req.params.userPage + '/' + req.params.objectKey}, function(err, url){
        if(err) next(err)
        else{
            res.json(url)
        }
    })
})


router.post('/upload/:user', upload.array('image'), (req,res,next)=>{

    const {numberOfImages, username} = req.user

    if(numberOfImages>=20) next(new Error('You have reached your limit of photos'))

    else {
    const thumbData = { Key: 'thumbnail/' + username + '/' + req.files[0].originalname, Body: req.files[0].buffer };
    const photoData = { Key: username + '/' + req.files[1].originalname, Body: req.files[1].buffer }
    
    const wholeImage = new Promise((resolve, reject)=>{
        s3Bucket.putObject(photoData, function (err, data) {
            if (err) {
                reject(err)
            } else {
                resolve(data)
            }
        })
    })

    const thumbNail = new Promise((resolve, reject)=>{
        s3Bucket.putObject(thumbData, function (err, data) {
            if (err) {
                reject(err)
            } else {
                resolve(data)
            }
        })
    })

    Promise.all([wholeImage, thumbNail]).then(bundle=>{
        req.user.numberOfImages++
        req.user.save().then(_=>res.json(bundle))
    })
    }
})

//To-do: Refine this authentication

router.put('/', (req,res,next)=>{

    console.log('We will tell S3 to delete ', req.body)

    if(!req.body.key.startsWith(req.user.username+'/')){
        const error = new Error('You do not have permission to delete this photo.')
        error.status=403
        next(error)
    }
    else{

        s3Bucket.deleteObjects({Bucket: process.env.BUCKETNAME, Delete: {Objects: [{Key: 'thumbnail/'+req.body.key},{Key: req.body.key}]}}, (err, data) => {
            if(err) next(err)
            else{
                req.user.numberOfImages--
                req.user.save().then(_=>{
                    res.sendStatus(204)
                })
                .catch(next)
            }
        })
    }
})

module.exports = router