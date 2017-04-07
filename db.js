var pg = require('pg');

pg.defaults.ssl = true;
var db = new pg.Client(process.env.DATABASE_URL);
db.connect();

exports.getTest = function (req, res) {
    db.query("SELECT * FROM test").then(function (data) {
        res.json(data.rows);
    });
    
};

exports.getPerson = function (req, res) {
    db.query("SELECT * FROM person WHERE id= $1;", [req.params.id]).then(function (data) {
        console.log(data.rows);
        res.json(data.rows);
    })
        .catch(function (error) {
            console.log("ERROR:", error.message || error); // print the error;
        });

};

exports.setPerson = function (req, res) {
    db.query("INSERT INTO person (name, date) VALUES ($1, current_timestamp) RETURNING id, name;", [req.params.name]).then(function (data) {
       res.json(data.rows);
    });
};

exports.getExercise = function (req, res) {
    db.query("SELECT * FROM exercise").then(function (data) {
        res.json(data.rows);
    })
};

exports.getCurrentExercise = function (req, res) {
    db.query("SELECT * FROM exercise WHERE id= $1", [req.params.id]).then(function (data) {
        res.json(data.rows);
    })
};

exports.textPy = function (req, res) {
    var x = "";
    console.log("1");
    x += "1";
    var spawn = require("child_process").spawn;
    console.log("2");
    x += "2";
    var process = spawn('pyhton', ["test.py", req.params.text]);
    console.log("3");
    x += "3";
    process.stdout.on('data', function(data){
        console.log("tere");
        console.log(data);
        //res.json(data);
        x += data;
    });
    res.json(x);
};