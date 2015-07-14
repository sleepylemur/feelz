module.exports = function(app, models) {
  app.get('/test', function(req,res) {
    res.send('test');
  });

  app.get('/listusers', function(req,res) {
    models.User.findAll().then(function(data) {
      res.json(data);
    });
  });
};
