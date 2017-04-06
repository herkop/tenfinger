var express = require('express');
var app = express();
var db = require('./db');

app.use(express.static(__dirname));
/* GET home page. */
app.get('/', function(req, res, next) {
  res.sendFile('/index.html', { root: __dirname });
});
app.get('/exercise', function(req, res) {
  res.sendFile('/views/exercises.html', { root: __dirname});
});
app.get('/exercise/*', function(req, res) {
  res.sendFile('/views/exercises.html', { root: __dirname});
});



app.get('/test', db.getTest);
app.get('/person/id/:id', db.getPerson);
app.get('/person/add/:name', db.setPerson);
app.get('/exec', db.getExercise);
app.get('/currentexec/id/:id', db.getCurrentExercise);
app.get('/python/text/:text', db.textPy);


app.listen(process.env.PORT || 3100, function(){
  if(process.env.PORT) {
    console.log('Website listening on', process.env.PORT);
  } else {
    console.log('Website listening on port 3100!');
  }
});