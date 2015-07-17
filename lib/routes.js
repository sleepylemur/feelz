var fs = require('fs');
var multer = require('multer'); // handles multipart file uploads
var jwt = require('jsonwebtoken');
var forge = require('node-forge');
var request = require('superagent');
var jwtsecret = process.env.PANDA_JWT_SECRET;

var uuid = require('node-uuid');
var AWS = require('aws-sdk');
AWS.config.region = 'us-east-1';
var photoBucket = new AWS.S3({params: {Bucket: 'pandafronting'}});
function uploadToS3(file, destFileName, callback) {
  photoBucket
    .upload({
      ACL: 'public-read',
      Body: fs.createReadStream(file.path),
      Key: destFileName,
      ContentType: 'application/octet-stream' // force download if it's accessed as a top location
    })
    // http://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/S3/ManagedUpload.html#httpUploadProgress-event
    // .on('httpUploadProgress', function(evt) { console.log(evt); })
    // http://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/S3/ManagedUpload.html#send-property
    .send(callback);
}

module.exports = function(app, models) {
  app.post('/imageUpload',  multer({limits: {fileSize:50*1024*1024}, putSingleFilesInArray: true}), function(req,res) {
    if (!req.files) {
      res.status(403).send('no files').end();
    } else {
      uploadToS3(req.files.image[0],uuid.v1(), function (err, data) {
        if (err) {
            console.error(err);
            res.status(500).send('failed to upload to s3').end();
        } else {
          // data.ETag
          // data.Location
          // console.log(data);
          res.send(data.Location);
        }
      });
    }
  });

  app.get('/listusers', function(req,res) {
    models.User.findAll().then(function(data) {
      res.json(data);
    });
  });
  app.get('/api/secret', function(req,res){
    res.json(req.user);
  });

  app.post('/login', function(req, res){
    // check if email is in the database
    models.User.find({where:{email:req.body.email}}).then(function(user){
      if(user){
        if (models.User.comparePassword(user, req.body.password)) {
          // grant token
          var token  = jwt.sign({id: user.dataValues.id}, jwtsecret, {expiresInMinutes: 60});
          res.json({token:token, id: user.dataValues.id});
        } else {
          res.status(403).json({error: 'password incorrect'});
        }
      } else {
        res.status(403).json({error: 'user not found'});
      }
    });
  });
  app.post('/fbsignin', function(req, res){
    request.get("https://graph.facebook.com/v2.4/me?access_token="+req.body.token)
      .end(function(err,data) {
         if (err) throw(err);
        // confirm token & id we were passed match up
        if (req.body.fbID == JSON.parse(data.res.text).id){
          models.User.find({where:{facebookid: req.body.fbID}}).then(function(user){
            if(user){
              var token  = jwt.sign({id: user.id}, jwtsecret, {expiresInMinutes: 60});
            } else {
              models.User.create({facebookid: req.body.fbID}).then(function(new_user){
                 var token  = jwt.sign({id: new_user.dataValues.id}, jwtsecret, {expiresInMinutes: 60});
              });
            }
          });
        } else {
          res.status(403).end();
        }
      });

  });
  app.post('/signup', function(req, res){
    models.User.find({where: {email: req.body.email}}).then(function(user){
      if (user) {
        // user already exist so return error
        console.log('ERROR: user already exists');
        res.status(403).json({error: 'user already exists'});
      } else {
        // user doesn't exist so create user
        // md is a hashing method
        // var md = forge.md.sha256.create();
        // var salt = forge.random.getBytesSync(16);
        // md.update(req.body.password + salt);
        // var password_digest = md.digest().toHex() + salt;
        models.User.create({
          email: req.body.email,
          password: req.body.password // model.User handles hashing the password
        }).then(function(new_user){
          var token  = jwt.sign({id: new_user.dataValues.id}, jwtsecret, {expiresInMinutes: 60});
          res.json({token:token, id: new_user.dataValues.id});
        });
      }

    }).catch(function(err){
      // server error. maybe db doesn't exist or is off?
      console.log(err);
      res.status(500).send(err);
    });


  });
  app.get('/api/post?:id', function(req, res){
    models.Post.findById(req.query.id).then(function(post){
      res.send(post);
    });
  });
  app.post('/api/newPost', function(req, res){
    models.Post.create({
      emotion: req.body.emotion,
      message: req.body.message,
      location: [req.body.location.lat, req.body.location.lng],
      userId: req.user.id
    }).then(function(new_post){
      res.json(new_post);
    }).catch(function(err){
      console.log(err);
      res.status(500).send(err);
    });
  });
  app.get('/api/emotions', function(req, res){
    models.Post.findAll().then(function(data){
      res.json(data);
    });
  });
  
  app.get('/api/newsfeed', function(req,res){
    // fetch the newest post of the last 3 hrs
    models.Post.findAll({where:{
      createdAt: {
        $lt: new Date(),
        $gt: new Date(new Date() - 3 * 60 * 60 * 1000)
      }}}).then(function(data){
          res.json(data);
      });
  });

};
