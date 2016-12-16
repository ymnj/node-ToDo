var express = require('express');
var app = express();

var port = process.env.PORT || 3000;

//Public files
app.use('/assets', express.static(__dirname + '/public'));

//View Engine
app.set('view engine', 'ejs');

app.get('/', function(req, res){
  res.send('hello');
})


app.listen(port);