var Sequelize = require('sequelize');

module.exports = function(db) {
  return {
    User: db.define('User', {
      email: {type: Sequelize.STRING, allowNull: false, unique: true},
      password: {type: Sequelize.STRING, allowNull: false}
    })
  };
};
