var pg = require('pg');

//pg.defaults.ssl = true;
pg.connect(process.env.DATABASE_URL, function (err, client) {
    if (!err){
        console.log("Connected to databse");
    }
    else{
        throw err;
    }
});