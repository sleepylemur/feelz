var jwt = require('jsonwebtoken');
var forge = require('node-forge');

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
          var token  = jwt.sign({email: req.body.email}, jwtsecret, {expiresInMinutes: 60});
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

    request.get("https://graph.facebook.com/v2.4/me?access_token="+req.token)
      .end(function(err,data) {
         if (err) throw(err);
         console.log(data);
         req.session.user = {name: JSON.parse(data.res.text).name};
         console.dir(data.res);
         res.send('hello '+ req.session.user.name);
      });

  });
  app.post('/signup', function(req, res){
    models.User.find({where: {email: req.body.email}}).then(function(data){
      if (data) {
        // user already exist so return error
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
        }).then(function(){
          var token  = jwt.sign({email: req.body.email}, jwtsecret, {expiresInMinutes: 60});
          res.json({token:token});
        });
      }

    }).catch(function(err){
      // server error. maybe db doesn't exist or is off?
      console.log(err);
      res.status(500).send(err);
    });


  });
  app.get('/listposts', function(req, res){
    models.Post.findAll().then(function(data){
      res.json(data);
    });
  });

};
