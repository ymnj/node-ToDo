var Todos = require('../models/todoModel');

module.exports = function(app){
  app.get('/api/setupTodos', function(req, res){

      // seed database
      var starterTodos = [
        {
          username: 'Tom',
          todo: 'Buy milk',
          isDone: false,
          hasAttachment: false
        },
        {
          username: 'Sharon',
          todo: 'Wash car',
          isDone: false,
          hasAttachment: false
        },
        {
          username: 'Jake',
          todo: 'Go to the gym',
          isDone: false,
          hasAttachment: false
        }
      ]

      Todos.create(starterTodos, function(err, results){
        res.send(results);  
      });
  });
};