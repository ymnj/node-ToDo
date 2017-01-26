const User = require('../models/userModel');
const {ObjectID} = require('mongodb');
const _ = require('lodash');
const authenticate = require('../../middleware/authenticate');

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

  //TEST
  app.get('/test/me', authenticate, (req, res) => { 
    res.send(req.user)
  })


  /* ------------ POST ------------ */

  // Create new user
  app.post('/user', (req, res) => {

    let params = _.pick(req.body, ['userName', 'password', 'firstName', 'lastName', 'email'])

    let newUser = new User(params);

    newUser.save().then(() => {
      return newUser.generateAuthToken();
    }).then((token) => {
      res.header('x-auth', token).send(newUser)
    }).catch((err) => {
      res.status(400).send(err);
    })
  });


  app.post('/users/login', (req, res) => {

    let params = _.pick(req.body, ['email', 'password'])

    User.findByCredentials(params.email, params.password).then((user) => {
      user.generateAuthToken().then((token) => {
        res.header('x-auth', token).send(user);
      });
    }).catch((e) => {
      res.status(400).send();
    })
  })


  /* ------------ UPDATE ------------ */

  app.patch('/user/:id', (req, res) => {

    let updateID = req.params.id
    let params = _.pick(req.body, ['userName', 'password', 'firstName', 'lastName', 'email'])

    if(!ObjectID.isValid(updateID)){
      return res.status(404).send()
    }

    User.findByIdAndUpdate(updateID, {$set: params}, {new: true}).then((user) => {
      if(!user) {
        return res.status(404).send();
      }

      res.send({user})
    }).catch((err) => {
      res.status(400).send(err);
    })

  })


  /* ------------ DELETE ------------ */

  app.delete('/user/:id', (req, res) => {
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
