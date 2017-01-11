var users = require('../models/userModel');
var bodyParser = require('body-parser');

module.exports = (app) => {

  app.use(bodyParser.json());
  app.use(bodyParser.urlencoded({ extended: true }));

  //GET

  //POST

}