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
//         console.log('THESE ARE THE FILES ',files )
//         res.json(files)
//     })
// })
// ------ FORMERLY USING MULTER AND FILE SYSTEM TO STORE PHOTOS ------



router.get('/library/:userPage', (req, res, next)=>{

    s3Bucket.listObjects({Prefix: req.params.userPage}, (err, data)=>{

        if(err) res.json(503)

        const bucketContents = data.Contents;

        console.log('We get this from the list operation ', data)

        if(bucketContents.length>0){

            const promisifiedMap = bucketContents.map(bucketContents=>{

                const urlParams = {Bucket: process.env.BUCKETNAME, Key: bucketContents.Key};

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
                    console.log('result of promise: ', url)
                    res.json(url)
                })
                .catch(next)
        }
     })
})


router.post('/upload/:user', upload.single('image'), (req,res,next)=>{

    
    const {firstName, lastName, id, numberOfImages} = req.user

    if(id!==1 && numberOfImages>=20) next(new Error('You have reached your limit of photos'))
    else {
    const data = { Key: firstName+lastName+id + '/' + req.file.originalname, Body: req.file.buffer };
    s3Bucket.putObject(data, function (err, data) {
        if (err) {
            console.log('Error uploading data: ', data);
            res.sendStatus(503)
        } else {
            console.log('succesfully uploaded the image!')
            User.findById(req.user.id).then(user=>{
                user.numberOfImages++
                user.save().then(_=> res.json(data))
            })
        }
    });
    }
})

module.exports = router