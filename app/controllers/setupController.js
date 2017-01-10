var Todo = require('../models/todoModel');
var User = require('../models/userModel');

module.exports = function(app){
  app.get('/api/setupTodo', function(req, res){
      
    // seed database
    var newTodo = new Todo({
      title: 'Study',
      description: 'a',
      completedAt: 12
    });

    newTodo.save().then((doc) => {
      console.log('Successfully Saved')
      res.send(doc)
    }).catch((err) => {
      console.log('unable to save');
      res.send(err.errors.description.message);
    })

  });

  app.get('/api/setupUser', (req, res) => {

    var newUser = new User({
      userName: 'TommiDummi',
      firstName: 'Tom',
      lastName: 'Hung',
      email: 'tom@tomhung.ca'
    });

    newUser.save().then((doc) => {
      console.log('User saved');
      res.send(doc)
    }).catch((err) => {
      console.log('Unable to save user');
      console.log(JSON.stringify(err, undefined, 2));
      res.send(err);
    });

  });
};