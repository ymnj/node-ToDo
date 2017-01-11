var todos = require('../models/todoModel');
var bodyParser = require('body-parser');

module.exports = (app) => {

  app.use(bodyParser.json());
  app.use(bodyParser.urlencoded({ extended: true }));


  //CREATE
  app.post('/todos', (req, res) => {
    console.log(req.body);
    // if(req.body.id){
    //   //Has an ID so it's a new todo
    //   todos.findByIdAndUpdate(req.body.id, {
    //     title: req.body.title,
    //     description: req.body.description,
    //     isDone: req.body.isDone,
    //     hasAttachment: req.body.hasAttachment,
    //     completedAt: req.body.completedAt
    //   }, function(err, todo){
    //     if(err) throw err;

    //     res.send('Update Success');
    //   })
    // } else {
    //   var newTodo = todos({
    //     title: req.body.title,
    //     description: req.body.description,
    //     isDone: req.body.isDone,
    //     hasAttachment: req.body.hasAttachment,
    //     completedAt: req.body.completedAt
    //   });
    //   newTodo.save(function(err){
    //     if(err) throw err;

    //     res.send("New todo saved");
    //   });
    // }
  })

  //READ
  app.get('/todos', (req, res) => {
    todos.find({}, function(err, todos){
      if(err) throw err;

      res.send(todos);
    })
  })

  app.get('/todo/:id', function(req, res){

    todos.findById({ _id: req.params.id }, function(err, todo){
      if(err) throw err;

      res.send(todo);
    });
  });

  //UPDATE



  //DELETE


}
