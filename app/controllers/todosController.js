const Todo = require('../models/todoModel');
const {ObjectID} = require('mongodb');
const _ = require('lodash');

const authenticate = require('../../middleware/authenticate');

module.exports = (app) => {
  
  /* ------------ GET ------------ */

  //All todos
  app.get('/todos', (req, res) => {
    Todo.find({}).then((todos) => {
      res.send({
        todos
      })
    }).catch((err) => {
      res.status(400).send(err);
    })
  });

  app.get('/todos/user', authenticate, (req, res) => {
    Todo.find({
      _creator: req.user._id
    }).then((todos) => {
      res.send({
        todos
      })
    }).catch((err) => {
      res.status(400).send(err);
    })
  });


  //Single todo
  app.get('/todos/:id', authenticate, function(req, res){

    if(!ObjectID.isValid(req.params.id)){
      return res.status(404).send();
    }
 
    Todo.findOne({
      _id: req.params.id,
      _creator: req.user._id
    }).then((todo) => {
      if(!todo) {
        return res.status(404).send();
      }
      res.send({todo})
    }).catch((err) => {
      res.status(400).send()
    });
  });


  /* ------------ POST ------------ */
  app.post('/todo', authenticate, (req, res) => {

    let params = _.pick(req.body, ['title', 'description', 'hasAttachment']);
    params._creator = req.user._id;
    
    let newTodo = new Todo(params);
    newTodo.save().then((todo) => {
      res.send(todo);
    }).catch((err) => {
      res.status(400).send(err);
    });
  });


  /* ------------ UPDATE ------------ */

  app.patch('/todo/:id', authenticate, (req, res) => {

    let updateId = req.params.id;
    let params = _.pick(req.body, ['title', 'description', 'isDone', 'hasAttachment'])

    if(!ObjectID.isValid(req.params.id)){
      return res.status(404).send();
    }

    if(_.isBoolean(params.isDone) && params.isDone){
      params.completedAt = new Date().getTime();
    } else {
      params.isDone = false;
      params.completedAt = null;
    }

    Todo.findOneAndUpdate({
      _id: updateId,
      _creator: req.user._id
    }, {$set: params}, {new: true}).then((todo) => {
      if(!todo){
        return res.status(404).send();
      }

      res.send({todo})

    }).catch((err) => {
      res.status(400).send()
    })
  });



  /* ------------ DELETE ------------ */
  app.delete('/todo/:id', authenticate, (req, res) => {
    if(!ObjectID.isValid(req.params.id)){
      return res.status(404).send();
    }

    Todo.findOneAndRemove({
      _id: req.params.id,
      _creator: req.user._id
    }).then((todo) => {
      if(!todo) {
        return res.status(404).send();
      }

      res.send({todo})
    }).catch((err) => {
      res.status(400).send(err);
    })
  })
}