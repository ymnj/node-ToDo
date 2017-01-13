var users = require('../models/userModel');
var {ObjectID} = require('mongodb');

module.exports = (app) => {

  //GET
  app.get('/users', (req, res) => {
    users.find({}, (err, users) => {
      if(err) throw error;

      res.status(200)
        .send({users});
    });

  })


  app.get('/user/:id', (req, res) => {

    if(!ObjectID.isValid(req.params.id)){
      return res.status(400).send();
    }

    users.findById({
      _id: req.params.id
    }).then((user) => {
      if(!user){
        res.status(404).send()
      }
      res.send({user})
    }).catch((err) => {
      res.status(404).send()
    })

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
