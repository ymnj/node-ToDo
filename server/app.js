var express = require('express');
var app = express();

var mongoose = require('mongoose');
var db = require('./db');

var port = process.env.PORT || 3000;

//Public files
app.use('/assets', express.static(__dirname + '/public'));

//View Engine
app.set('view engine', 'ejs');

app.get('/', function(req, res){
  res.send('hello');
})


//Database Connections
mongoose.Promise = global.Promise;
mongoose.connect(db.getDbConnectionString());

//SEED
var setupController = require('../app/controllers/setupController');
setupController(app);

//Controllers
var apiController = require('../app/controllers/apiController');
apiController(app);
var todosController = require('../app/controllers/todosController');
todosController(app);


app.listen(port);