require('../config/config')

const express = require('express');
const app = express();

const mongoose = require('mongoose');
const db = require('./db');

const port = process.env.PORT;

const bodyParser = require('body-parser');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

//Public files
app.use('/assets', express.static(__dirname + '/public'));

//View Engine
app.set('view engine', 'ejs');

//Root
app.get('/', function(req, res){
  res.send('hello');
})

//Database Connections
mongoose.Promise = global.Promise;
mongoose.connect(db.getDbConnectionString());

//SEED
var seedController = require('./seed');
seedController(app);

//Controllers
var todosController = require('../app/controllers/todosController');
todosController(app);
var usersController = require('../app/controllers/usersController');
usersController(app);

app.listen(port, () => {
  console.log(`Server started. Listening on ${port}`)
});

module.exports = app;