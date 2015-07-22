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

module.exports = function(app, Db, io) {
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
    res.json({secret: 'shhhh'});
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
      console.log("/login",err);
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
  // return ctx.none("CREATE TABLE posts (id SERIAL PRIMARY KEY, user_id INTEGER REFERENCES users, timestamp TIMESTAMPTZ, lat DECIMAL, lng DECIMAL, message TEXT, emotion TEXT, image_url TEXT, location_name TEXT)");
  app.get('/api/posts', function(req,res) {
      db.many("SELECT posts.id, posts.user_id, posts.timestamp, posts.lat, posts.lng, posts.emotion, posts.image_url, posts.location_name, count(votes.id) as numvotes FROM posts LEFT JOIN votes ON posts.id = votes.post_id GROUP BY posts.id ORDER BY posts.timestamp DESC LIMIT 500;").then(function(posts) {
      res.json(posts);
    }).catch(function(err) {
      res.status(500).send(err);
    });
  });
  app.post('/api/posts', function(req, res){
    console.log(req.body);
    db.one("INSERT INTO posts (timestamp, emotion, message, lat, lng, user_id, location_name, image_url) VALUES ($1,$2,$3,$4,$5,$6,$7,$8) RETURNING *",
      [new Date(), req.body.emotion, req.body.message, req.body.lat, req.body.lng, req.user.id, req.body.location_name, req.body.image_url])
      .then(function(post) {
        post.numvotes = 0;
        io.sockets.emit('list new post', post);
        res.json(post);
      }).catch(function(err) {
        console.log("/posts",err);
        res.status(500).send(err);
      });
  });
  app.get('/api/users/:user_id/votes', function(req,res) {
    // find which posts the given user has voted on
    db.many("SELECT post_id FROM votes WHERE user_id = $1", [req.params.user_id]).then(function(votes) {
      // send the list of post_ids to the client
      res.json(votes);
    }).catch(function(err) {
      // return any errors
      res.status(500).send(err);
    });
  });
  app.post('/api/votes', function(req,res) {
    // make sure user hasn't voted on the same post before
    db.none("SELECT * FROM votes WHERE user_id = $1 AND post_id = $2", [req.body.user_id, req.body.post_id])
      .then(function() {
        // perform the insert
        return db.none("INSERT INTO votes (user_id,post_id) VALUES ($1,$2)", [req.body.user_id, req.body.post_id]);
      }).then(function() {
        return db.one("SELECT posts.id,count(*) FROM posts JOIN votes ON posts.id = votes.post_id WHERE posts.id = $1 GROUP BY posts.id", [req.body.post_id]);
      }).then(function(postvotes) {
        io.sockets.emit('update postvotes', postvotes);
        // return 'ok'
        res.status(200).end();
      }).catch(function(err) {
        console.log('err it',err);
        // something went wrong, so return the error
        res.status(500).send(err);
      });
  });

  app.get('/api/emotions', function(req, res){

    // convert strings to numbers for lat lng coords
    var coords = {}
    for (k in req.query) { coords[k] = Number(req.query[k]) };

    // calls db with coords slightly more expansive than client's lat lng map bounds.
    db.many("SELECT * FROM posts WHERE lat < $1 AND lat > $2 AND lng > $3 AND lng < $4 ORDER BY timestamp DESC LIMIT 500;",
      [coords.n + 0.1, coords.s - 0.1, coords.w - 0.1, coords.e + 0.1]).then(function(posts) {
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
  app.post('/testpost', function(req,res) {
    console.log("/testpost",req.body);
    res.end();
  });
};
