var jwt = require('jsonwebtoken');
var forge = require('node-forge');

var jwtsecret = "e5yjejeyj5ut45uuuu6j6jr";

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
    res.json({msg: "hellooo ~~ "});
  });
  app.post('/login', function(req, res){
    console.log(req.body);
    res.json({user: req.body});
  });

  app.post('/signup', function(req, res){
    console.log(req.body);

    models.User.find({email: req.body.email}).then(function(){
      // user already exist so return error 
      res.status(403).end();

    }).catch(function(){
      // user doesn't exist so create user 
      // md is a hashing method
      var md = forge.md.sha256.create(); 
      var salt = forge.random.getBytesSync(16);
      md.update(req.body.password + salt);
      var password_digest = md.digest().toHex() + salt; 

      models.User.create({
        email: req.body.email, 
        password: password_digest
      }).then(function(){
        var token  = jwt.sign({email: req.body.email}, jwtsecret, {expiresInMinutes: 60});
        res.json({token:token});

      });
    }); 

    res.json({user: req.body});
  });
};
