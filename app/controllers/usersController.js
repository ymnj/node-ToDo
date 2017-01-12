var users = require('../models/userModel');

module.exports = (app) => {

  //READ
  app.get('/users', (req, res) => {
    users.find({}, (err, users) => {
      if(err) throw error;

      res.status(200)
        .send(users);
    });

  })

  //POST

}