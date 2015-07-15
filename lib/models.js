var Sequelize = require('sequelize');

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

  return models;
};
