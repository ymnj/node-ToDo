var users = require('../models/userModel');

module.exports = (app) => {

  //GET
  app.get('/users', (req, res) => {
    users.find({}, (err, users) => {
      if(err) throw error;

      res.status(200)
        .send({users});
    });

  })

  //POST
  app.post('/users', (req, res) => {

    var newUser = users({
      userName: req.body.userName,
      firstName: req.body.firstName,
      lastName: req.body.lastName,
      email: req.body.email
    });

    newUser.save().then((user) => {
      res.send(user);
    }).catch((err) => {
      res.status(400).send(err);
    })
  });


}
