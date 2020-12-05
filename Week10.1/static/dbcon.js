var mysql = require("mysql");
var pool = mysql.createPool({
    connectionLimit: 10,
    host: "classmysql.engr.oregonstate.edu",
    user: "cs290_kimjera",
    password: "Test123!@#",
    database: "cs290_kimjera",
});

module.exports.pool = pool;
