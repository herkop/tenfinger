var express = require('express');
var app = express();

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



app.listen(process.env.PORT || 3100, function(){
  if(process.env.PORT) {
    console.log('Website listening on', process.env.PORT);
  } else {
    console.log('Website listening on port 3100!');
  }
});