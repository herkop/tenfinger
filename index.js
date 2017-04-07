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

app.get('/py/text/:text', function(req, res){
    if(req.params.text){
        var python = require('child_process').spawn(
            'python',
            // second argument is array of parameters, e.g.:
            ["test.py"
                , req.params.text]
        );
        var output = "";
        python.stdout.on('data', function(data){ output += data });
        python.on('close', function(code){
            if (code !== 0) {
                return res.send(500, code);
            }
            return res.send(200, output);
        });
    } else { res.send(500, 'No file found') }
});

app.get('/test', db.getTest);
app.get('/person/id/:id', db.getPerson);
app.get('/person/add/:name', db.setPerson);
app.get('/exec', db.getExercise);
app.get('/currentexec/id/:id', db.getCurrentExercise);


app.listen(process.env.PORT || 3100, function(){
  if(process.env.PORT) {
    console.log('Website listening on', process.env.PORT);
  } else {
    console.log('Website listening on port 3100!');
  }
});