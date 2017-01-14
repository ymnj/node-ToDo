const Todo = require('../models/todoModel');
const {ObjectID} = require('mongodb');

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
    
    let newTodo = Todo({
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
  app.delete('/todos/:id', (req, res) => {
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