var configValues = require('../../config/config');

module.exports = {
  getDbConnectionString: function(){
    return 'mongodb://localhost:27017/Plans';
  }
};