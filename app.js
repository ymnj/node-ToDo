var express = require('express');
var app = express();

var mongoose = require('mongoose');
var config = require('./config');

var port = process.env.PORT || 3000;

//Public files
app.use('/assets', express.static(__dirname + '/public'));

//View Engine
app.set('view engine', 'ejs');

app.get('/', function(req, res){
  res.send('hello');
})


//Database Connections
mongoose.connect(config.getDbConnectionString());

//SEED
var setupController = require('./controllers/setupController');
setupController(app);



app.listen(port);