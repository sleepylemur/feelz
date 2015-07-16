var jwt = require('jsonwebtoken');
var forge = require('node-forge');
var request = require('superagent');
var jwtsecret = process.env.PANDA_JWT_SECRET;

module.exports = function(app, models) {
  app.get('/test', function(req,res) {
    res.send('test');
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
        console.log('loginroute',user);
        // grabbing the password in db and trimming off salt
        // var stored_password_hash = data.password.slice(0,-16);
        // var salt = data.password.slice(-16);
        //
        // //created a hash for input password
        // var md = forge.md.sha256.create();
        // md.update(req.body.password + salt);
        // var input_hash = md.digest().toHex();
        //compare to see if two match
        if (models.User.comparePassword(user, req.body.password)) {
          // grant token
          var token  = jwt.sign({id: user.dataValues.id}, jwtsecret, {expiresInMinutes: 60});
          res.json({token:token});
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
          res.json({token:token});
        });
      }

    }).catch(function(err){
      // server error. maybe db doesn't exist or is off?
      console.log(err);
      res.status(500).send(err);
    });


  });
  app.get('/newPost', function(req, res){
    console.log(req.body);
    modelsPost.create({
      emotion: req.body.emotion,
      message: req.body.message,
      location: [req.body.location.lat, req.body.location.lng]
    }).then(function(new_post){
      console.log(new_post);
    })
  })
  app.get('/listposts', function(req, res){
    models.Post.findAll().then(function(data){
      res.json(data);
    });
  });

};
