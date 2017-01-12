var todos = require('../models/todoModel');

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

  //POST
  app.post('/todos', (req, res) => {
    
    var newTodo = todos({
      title: req.body.title
      // description: req.body.description,
      // isDone: req.body.isDone,
      // hasAttachment: req.body.hasAttachment,
      // completedAt: req.body.completedAt
    });
    newTodo.save().then((doc) => {
      res.send(doc);
    }).catch((err) => {
      res.status(400).send(err);
    });
  });


  app.get('/todo/:id', function(req, res){

    todos.findById({ _id: req.params.id }, function(err, todo){
      if(err) throw err;

      res.send(todo);
    });
  });

  //UPDATE



  //DELETE
}