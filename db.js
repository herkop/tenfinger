var pg = require('pg');

//pg.defaults.ssl = true;
pg.connect(process.env.DATABASE_URL, function (err, client) {
    console.log("Starting");
    if (!err){
        console.log("Connected to database");
    }
    else{
        console.log("error!!");
        throw err;
    }
});