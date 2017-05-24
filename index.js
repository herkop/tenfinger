var express = require('express');
var app = express();
var db = require('./db');
var bodyParser = require('body-parser');
app.use(bodyParser.json());
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
app.get('/person/:name', db.isPerson);
app.get('/person/add/:name', db.setPerson);
app.get('/exec', db.getExercise);
app.get('/currentexec/id/:id', db.getCurrentExercise);
app.get('/setting/:person', db.getSettings);
app.get('/updateset/:person/:setting/:value', db.updateSettings);
app.get('/newgroup/:name/:owner/:expires', db.addNewExeGroup);
app.post('/newexe', db.addNewExercise);
app.get('/myexes/:owner', db.getMyExeGroup);
app.get('/sharedgroup/:id', db.getSharedExeGroup);
app.get('/sharedexes/:id', db.getSharedExes);
app.post('/testexe', function (req, res) {
    console.log(req.body);
    res.json([]);
});

app.listen(process.env.PORT || 3100, function(){
  if(process.env.PORT) {
    console.log('Website listening on', process.env.PORT);
  } else {
    console.log('Website listening on port 3100!');
  }
});