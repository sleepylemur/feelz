var Sequelize = require('sequelize');

module.exports = function() {
  switch (process.env.NODE_ENV) {
    case 'testing':
      return new Sequelize('pandatest', null, null, {dialect: 'postgres', logging: null});
    case 'development':
      return new Sequelize('pandadev', null, null, {dialect: 'postgres', logging: null});
    case 'production':
      throw(new Error('production db not setup yet in db.js'));
    default:
      throw('NODE_ENV not specified or unknown. should be "testing", "development", or "production"');
  }
}
