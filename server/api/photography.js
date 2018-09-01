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

    console.log('Libraries, ', req.params)

    s3Bucket.getSignedUrl('getObject', {Bucket: process.env.BUCKETNAME, Key: req.params.userPage + '/' + req.params.objectKey}, function(err, url){
        if(err) next(err)
        else{
            res.json(url)
        }
    })
})


router.post('/upload/:user', upload.array('image'), (req,res,next)=>{

    const {firstName, lastName, id, numberOfImages} = req.user

    if(id!==1 && numberOfImages>=20) next(new Error('You have reached your limit of photos'))

    //REFACTOR TO A PROMISE.MAP

    else {
    const thumbData = { Key: 'thumbnail/' + firstName+lastName+id + '/' + req.files[0].originalname, Body: req.files[0].buffer };
    const photoData = { Key: firstName+lastName+id + '/' + req.files[1].originalname, Body: req.files[1].buffer }
    
    s3Bucket.putObject(photoData, function (err, data) {
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

    s3Bucket.putObject(thumbData, function (err, data) {
        if (err) {
            console.log('Error uploading data: ', data);
            res.sendStatus(503)
        } else {
            console.log('succesfully uploaded the thumbnail!')
        }
    });

    }
})

router.put('/', (req,res,next)=>{

    console.log('We will tell S3 to delete ', req.body)

    s3Bucket.deleteObject({Bucket: process.env.BUCKETNAME, Key: req.body.key}, (err, data) => {
        if(err) next(err)
        else{
            res.sendStatus(204)
        }
    })
})

module.exports = router