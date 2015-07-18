var fs = require('fs');
var multer = require('multer'); // handles multipart file uploads
var jwt = require('jsonwebtoken');
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

module.exports = function(app, Db) {
  var db = Db.db;
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

  app.get('/users', function(req,res) {
    db.many("SELECT * FROM users").then(function(data) {
      res.json(data);
    }).catch(function(e) {
      res.status(500).send(e);
    });
  });
  app.get('/api/secret', function(req,res){
    res.json(req.user);
  });

  app.post('/login', function(req, res){
    // check if email is in the database
    db.one("SELECT * FROM users WHERE email = $1", req.body.email).then(function(user){
      return Db.comparePassword(user.password, req.body.password).then(function(passmatches) {
        if (passmatches) {
          // grant token
          var token  = jwt.sign({id: user.id}, jwtsecret, {expiresInMinutes: 60});
          res.json({token:token, id: user.id});
        } else {
          res.status(403).json({error: 'password incorrect'});
        }
      });
    }).catch(function(err) {
      console.log(err);
      res.status(403).json({error: 'user not found'});
    });
  });
  app.post('/fbsignin', function(req, res){
    request.get("https://graph.facebook.com/v2.4/me?access_token="+req.body.token)
      .end(function(err,data) {
        if (err) throw(err);
        // confirm that token matches id (no malicious spoofing behavior)
        if (req.body.fbID == JSON.parse(data.res.text).id){
          db.one("SELECT * FROM users WHERE facebookid = $1", req.body.fbID).then(function(user){
            var token  = jwt.sign({id: user.id}, jwtsecret, {expiresInMinutes: 60});
            res.json({token:token, id: user.id})
          }).catch(function() {
            // user not found so create
            db.one("INSERT INTO users (facebookid) VALUES ($1) RETURNING id",req.body.fbID).then( function(user) {
              var token  = jwt.sign({id: user.id}, jwtsecret, {expiresInMinutes: 60});
              res.json({token:token, id: user.id})
            }).catch(function(err) {
              res.status(500).send(err);
            });
          });
        } else {
          res.status(403).end();
        }
      });

  });
  app.post('/signup', function(req, res){
    db.none("SELECT * FROM users WHERE email = $1", req.body.email).then(function() {
      // we confirmed user doesn't exist, so create user
      Db.digestPassword(req.body.password).then(function(password_digest) {
        return db.one("INSERT INTO users (email,password) VALUES ($1,$2) RETURNING id", [req.body.email, password_digest]);
      }).then(function(user) {
        var token  = jwt.sign({id: user.id}, jwtsecret, {expiresInMinutes: 60});
        res.json({token:token, id: user.id})
      }).catch(function(err) {
        res.status(500).send(err);
      });
    }).catch(function(err){
      res.status(403).send("user already exists");
    });
  });
  app.get('/api/posts/:id', function(req, res){
    db.one("SELECT * FROM posts WHERE id = $1", req.params.id).then(function(post) {
      post.location = [post.lat, post.lng];
      res.json(post);
    });
  });
  app.post('/api/posts', function(req, res){
    db.one("INSERT INTO posts (timestamp, emotion, message, lat, lng, user_id) VALUES ($1,$2,$3,$4,$5,$6) RETURNING *",
      [new Date(), req.body.emotion, req.body.message, req.body.lat, req.body.lng, req.user.id])
      .then(function(post) {
        res.json(post);
      }).catch(function(err) {
        console.log(err);
        res.status(500).send(err);
      });
  });
  app.get('/api/emotions', function(req, res){
    db.many("SELECT * FROM posts").then(function(posts) {
      res.json(posts);
    }).catch(function(err) {
      res.status(500).send(err);
    });
  });

  app.get('/api/newsfeed', function(req,res){
    // fetch the newest post of the last 3 hrs
    var now = new Date();
    db.many("SELECT * FROM posts WHERE timestamp < $1 AND timestamp > $2", [now, new Date(now - 3*60*60*1000)]).then(function(posts) {
      res.json(posts);
    }).catch(function(err) {
      res.status(500).send(err);
    });
  });
};
