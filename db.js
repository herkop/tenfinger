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
        //console.log(data.rows);
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

exports.getSettings = function (req, res){
    db.query("SELECT setting_id, value from setting_selected where person_id = $1", [req.params.person]).then(function (data) {
        res.json(data.rows);
    });
};

exports.updateSettings = function (req, res) {

    db.query("UPDATE setting_selected SET value=$1 WHERE person_id=$2 and setting_id=$3; ", [req.params.value, req.params.person, req.params.setting]).then(function (data) {

        if(data.rows == 0) {
            db.query("INSERT INTO setting_selected (person_id, setting_id, value) SELECT $2, $3, $1 WHERE NOT EXISTS (SELECT value FROM setting_selected WHERE person_id=$2 and setting_id=$3);", [req.params.value, req.params.person, req.params.setting]).then(function (data1) {
                res.json(data1.rows);
            });
        }
        else{
            res.json(data.rows);
        }
    });
};