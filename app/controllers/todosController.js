const Todo = require('../models/todoModel');
const {ObjectID} = require('mongodb');
const _ = require('lodash');

module.exports = (app) => {
  
  /* ------------ GET ------------ */

  //All todos
  app.get('/todos', (req, res) => {
    Todo.find().then((todos) => {
      res.send({
        todos
      })
    }).catch((err) => {
      res.status(400).send(err);
    })
  });

  //Single todo
  app.get('/todos/:id', function(req, res){

    if(!ObjectID.isValid(req.params.id)){
      return res.status(404).send();
    }
 
    Todo.findById({
      _id: req.params.id
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
  app.post('/todo', (req, res) => {

    let params = _pick(req.body, ['title', 'description', 'hasAttachment'])
    
    let newTodo = new Todo(params);
    newTodo.save().then((todo) => {
      res.send(todo);
    }).catch((err) => {
      res.status(400).send(err);
    });
  });


  /* ------------ UPDATE ------------ */

  app.patch('/todo/:id', (req, res) => {

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

    Todo.findByIdAndUpdate(updateId, {$set: params}, {new: true}).then((todo) => {
      if(!todo){
        return res.status(404).send();
      }

      res.send({todo})

    }).catch((err) => {
      res.status(400).send()
    })
  });



  /* ------------ DELETE ------------ */
  app.delete('/todo/:id', (req, res) => {
    if(!ObjectID.isValid(req.params.id)){
      return res.status(404).send();
    }

    Todo.findByIdAndRemove(req.params.id).then((todo) => {
      if(!todo) {
        return res.status(404).send();
      }

      res.send({todo})
    }).catch((err) => {
      res.status(400).send(err);
    })
  })


}