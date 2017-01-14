const todos = require('../models/todoModel');
const {ObjectID} = require('mongodb');

module.exports = (app) => {
  
  //GET
  app.get('/todos', (req, res) => {
    todos.find().then((todos) => {
      res.send({
        todos
      })
    }).catch((err) => {
      res.status(400).send(err);
    })
  });


  app.get('/todo/:id', function(req, res){

    if(!ObjectID.isValid(req.params.id)){
      return res.status(404).send();
    }
 
    todos.findById({
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



  //POST
  app.post('/todo', (req, res) => {
    
    let newTodo = todos({
      title: req.body.title,
      description: req.body.description,
      isDone: req.body.isDone,
      hasAttachment: req.body.hasAttachment,
      completedAt: req.body.completedAt
    });
    newTodo.save().then((todo) => {
      res.send(todo);
    }).catch((err) => {
      res.status(400).send(err);
    });
  });


  //UPDATE



  //DELETE
}