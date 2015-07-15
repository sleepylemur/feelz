var Sequelize = require('sequelize');

module.exports = function(db) {
  return {
    User: db.define('User', {
      username: {type: Sequelize.STRING, allowNull: false, unique:true},
      email: {type: Sequelize.STRING, allowNull: false, unique: true},
      password: {type: Sequelize.STRING, allowNull: false},
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
    }),

  };
  User.hasMany(Post);
  User.hasMany(Vote);
  Post.belongTo(User);
  Vote.belongTo(User);
  Vote.belongTo(Post);


};
