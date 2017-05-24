var pg = require('pg');

pg.defaults.ssl = true;
var db = new pg.Client(process.env.DATABASE_URL);
db.connect();

exports.getTest = function (req, res) {
    db.query("SELECT * FROM test").then(function (data) {
        res.json(data.rows);
    },
    function (error) {
        res.json([]);
    });
    
};

exports.isPerson = function (req, res) {
    db.query("SELECT * FROM person WHERE name= $1;", [req.params.name]).then(function (data) {
        //console.log(data.rows);
        res.json(data.rows);
    },
    function (error) {
        res.json([]);
    });

};

exports.getPerson = function (req, res) {
    db.query("SELECT * FROM person WHERE id= $1;", [req.params.id]).then(function (data) {
        //console.log(data.rows);
        res.json(data.rows);
    },
    function (error) {
        res.json([]);
    });

};

exports.setPerson = function (req, res) {
    db.query("INSERT INTO person (name, date) VALUES ($1, current_timestamp) RETURNING id, name;", [req.params.name]).then(function (data) {
       res.json(data.rows);
    },
    function (error) {
        res.json([]);
    });
};

exports.getExercise = function (req, res) {
    db.query("SELECT * FROM exercise").then(function (data) {
        res.json(data.rows);
    },
    function (error) {
        res.json([]);
    });
};

exports.getCurrentExercise = function (req, res) {
    db.query("SELECT * FROM exercise WHERE id= $1", [req.params.id]).then(function (data) {
        res.json(data.rows);
    },
    function (error) {
        res.json([]);
    })
};

exports.getSettings = function (req, res){
    db.query("SELECT setting_id, value from setting_selected where person_id = $1", [req.params.person]).then(function (data) {
        res.json(data.rows);
    },
    function (error) {
        res.json([]);
    });
};

exports.updateSettings = function (req, res) {

    db.query("UPDATE setting_selected SET value=$1 WHERE person_id=$2 and setting_id=$3; ", [req.params.value, req.params.person, req.params.setting]).then(function (data) {

        if(data.rows == 0) {
            db.query("INSERT INTO setting_selected (person_id, setting_id, value) SELECT $2, $3, $1 WHERE NOT EXISTS (SELECT value FROM setting_selected WHERE person_id=$2 and setting_id=$3);", [req.params.value, req.params.person, req.params.setting]).then(function (data1) {
                res.json(data1.rows);
            },
            function (error) {
                res.json([]);
            });
        }
        else{
            res.json(data.rows);
        }
    },
    function (error) {
        res.json([]);
    });
};

var timeExpire = function (time) {
    var expires = time.split(" ");
    var multi = parseInt(expires[0]);
    var ex = "";
    if(expires[1] == "hour"){
        ex = "'1 hour'";
    }
    else if(expires[1] == "day"){
        ex = "'1 day'";
    }
    return [multi, ex];
};
exports.addNewExeGroup = function (req, res) {
    var user = req.params.owner;
    if( user == "null"){
        user = null;
    }
    var expires = timeExpire(req.params.expires);
    db.query("INSERT INTO shared_exercise_group (name, owner, expires) VALUES ($1, $2, (current_timestamp + $3 * (interval " + expires[1] + "))) RETURNING id, name;", [req.params.name, user, expires[0]]).then(function (data) {
        res.json(data.rows);
    },
    function (error) {
        res.json([]);
    });
};

exports.addNewExercise = function (req, res) {
    console.log(req.body);
    var expires = timeExpire(req.body.expires);
    var exer = req.body.exercise;
    db.query("INSERT INTO shared_exercise (name, exercise, type, exercise_group, ord, expires) VALUES ($1, $2, $3, $4, $5, (current_timestamp + $6 * (interval " + expires[1] + ")));", [req.body.name, req.body.exercise, req.body.type, req.body.group, req.body.order, expires[0]]).then(function (data) {
        res.json(data.rows);
    },
    function (error) {
        res.json([]);
    })
};

types = require('pg').types;
timestampOID = 1114;
types.setTypeParser(1114, function(stringValue) {
    return new Date(Date.parse(stringValue + "+0000"));
});

exports.getMyExeGroup = function (req, res) {
    var user = req.params.owner;
    if( user == "null"){
        user = null;
    }
    db.query("SELECT id, name, expires from shared_exercise_group where owner = $1 and expires > now();", [user]).then(function (data) {
        res.json(data.rows);
    },
    function (error) {
        res.json([]);
    });
};

exports.getSharedExeGroup = function (req, res) {
    db.query("SELECT id, name, expires from shared_exercise_group where id = $1 and expires > now();", [req.params.id]).then(function (data) {
        res.json(data.rows);
    },
    function (error) {
        res.json([]);
    });
};

exports.getSharedExes = function (req, res) {
    db.query("SELECT id, name, expires, exercise, type, ord from shared_exercise where exercise_group = $1 and expires > now() ORDER BY ord;", [req.params.id]).then(function (data) {
        res.json(data.rows);
    },
    function (error) {
        res.json([]);
    });
};