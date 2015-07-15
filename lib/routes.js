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
    // check if email is in the database 
    models.User.find({where:{email:req.body.email}}).then(function(data){
      if(data){
        // grabbing the password in db and trimming off salt 
        var stored_password_hash = data.password.slice(,-16);
        var salt = data.password.slice(-16);
        //created a hash for input password
        var input_hash = forge.md.sha256.create(req.body.password + salt);

        //compare to see if two match 
        if (stored_password_hash == input_hash){
          // grant token 
        }

      }
    })
    // grab password_digest, slice saltstring 
    // compare req.body.password hash to hash from password digest 
    // if so grant access 
    console.log(req.body);
    res.json({user: req.body});
  });

  app.post('/signup', function(req, res){
   console.log(req.body);

    models.User.find({where: {email: req.body.email}}).then(function(data){
     if (data){
       // user already exist so return error
       console.log("signup user found",arguments);
       res.status(403).end();
     } else {
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
     }

   }).catch(function(err){
     // server error. maybe db doesn't exist or is off?
     console.log(err);
     res.status(500).send(err);
   });

 });



};
