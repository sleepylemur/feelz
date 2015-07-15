var Sequelize = require('sequelize');
var forge = require('node-forge');

module.exports = function(db) {
  var models = {
    User: db.define('User', {
      username: {type: Sequelize.STRING, allowNull: true, unique:true},
      email: {type: Sequelize.STRING, allowNull: true, unique: true},
      password: {type: Sequelize.STRING, allowNull: true},
      facebookid:{type: Sequelize.INTEGER},
      avatar_image_url: {type: Sequelize.STRING}
    }),

    Post: db.define('Post', {
      id: { type: Sequelize.INTEGER, autoIncrement: true },
      timestamp: { type: Sequelize.DATE, defaultValue: Sequelize.NOW },
      location: {type: Sequelize.ARRAY(Sequelize.DECIMAL), allowNull: false},
      message: { type: Sequelize.STRING, allowNull: false},
      emotion: { type: Sequelize.STRING, allowNull: false},
      post_image_url: {type: Sequelize.STRING }
    }),

    Vote: db.define('Vote', {
      id: { type: Sequelize.INTEGER, autoIncrement: true },
      timestamp: { type: Sequelize.DATE, defaultValue: Sequelize.NOW }
    })

  };
  models.User.hasMany(models.Post);
  models.User.hasMany(models.Vote);
  models.Post.belongsTo(models.User);
  models.Vote.belongsTo(models.User);
  models.Vote.belongsTo(models.Post);

  models.User.beforeCreate(function(user, options) {
    var md = forge.md.sha256.create();
    var salt = forge.random.getBytesSync(16);
    md.update(user.password + salt);
    var password_digest = md.digest().toHex() + salt;
    user.password = password_digest;
  });

  models.User.comparePassword = function(user, test_password) {
    console.log("comparePassword",user);
    var stored_password_hash = user.password.slice(0,-16);
    var salt = user.password.slice(-16);

    //created a hash for test password
    var md = forge.md.sha256.create();
    md.update(test_password + salt);
    var test_hash = md.digest().toHex();
    //compare to see if two match
    return (stored_password_hash === test_hash);
  };

  return models;
};
