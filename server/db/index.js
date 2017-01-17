var configValues = require('../../config/config');

module.exports = {
  getDbConnectionString: function(){
    return process.env.MONGODB_URI;
  }
};