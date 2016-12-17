
var configValues = require('./config');

module.exports = {
  getDbConnectionString: function(){
    return `mongodb://${configValues.username}:${configValues.password}@ds131878.mlab.com:31878/plans`;
  }
};



