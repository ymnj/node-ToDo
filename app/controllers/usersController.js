const User = require('../models/userModel');
const {ObjectID} = require('mongodb');
const _ = require('lodash');

module.exports = (app) => {


  /* ------------ GET ------------ */

  // All users
  app.get('/users', (req, res) => {
    User.find({}, (err, users) => {
      if(err) throw error;

      res.status(200)
        .send({users});
    });

  })

  //One user
  app.get('/users/:id', (req, res) => {
    if(!ObjectID.isValid(req.params.id)){
      return res.status(404).send();
    }

    User.findById({
      _id: req.params.id
    }).then((user) => {
      if(!user){
        res.status(404).send()
      }
      res.send({user})
    }).catch((err) => {
      res.status(400).send()
    })
  })


  /* ------------ POST ------------ */

  // Create new user
  app.post('/user', (req, res) => {

    let newUser = User({
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

  /* ------------ UPDATE ------------ */

  app.patch('/users/:id', (req, res) => {

    let updateID = req.params.id
    let params = _.pick(req.body, ['userName', 'firstName', 'lastName', 'email'])

    if(!ObjectID.isValid(updateID)){
      res.status(404).send()
    }

    User.findByIdAndUpdate(updateID, {$set: params}, {new: true}).then((user) => {
      if(!user) {
        return res.status(404).send();
      }

      res.send({user})
    }).catch((err) => {
      req.status(404).send(err);
    })

  })




  /* ------------ DELETE ------------ */

  app.delete('/users/:id', (req, res) => {
    if(!ObjectID.isValid(req.params.id)){
      return res.status(404).send();
    }

    User.findByIdAndRemove(req.params.id).then((user) => {
      if(!user){
        return req.status(404).send();
      }

      res.send({user})
    }).catch((err) => {
      res.status(400).send(err);
    })

  })

}
