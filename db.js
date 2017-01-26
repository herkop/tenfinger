var pg = require('pg');

//pg.defaults.ssl = true;
/** pg.connect(process.env.DATABASE_URL, function (err, client) {
    console.log("Starting");
    if (!err){
        console.log("Connected to database");
    }
    else{
        console.log("error!!");
        throw err;
    }
});*/

var db = new pg.Client(process.env.DATABASE_URL);
db.connect();


exports.getTest = function (req, res) {
    var query = db.query("SELECT * FROM test").then(function (data) {
        console.log(data["rows"]);
        res.json(data);
    })
};