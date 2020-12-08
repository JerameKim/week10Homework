var express = require("express");

var mysql = require("./dbcon.js");

var app = express();
var handlebars = require("express-handlebars").create({
    defaultLayout: "main",
});


// [workout] is the name of the db I'm trying to create
var bodyParser = require("body-parser");


// More clear way to set the parser up
var jsonParser = bodyParser.json();
var urlParser = bodyParser.urlencoded({ extended: false });

// static
app.use(express.static('static'));

app.use(urlParser);
app.use(jsonParser);

app.engine("handlebars", handlebars.engine);
app.set("view engine", "handlebars");
app.set("views", "./views");

app.set("port", 10292);

// Shows homepage with all workouts
app.get("/", function (req, res, next) {
    var context = {};

    // connection pool is created in dbcon.js so a new one isn't created each time
    mysql.pool.query("SELECT id, name, reps, weight, lbs, DATE_FORMAT(date, '%m-%d-%Y') AS date FROM workout", function (err, rows, field) {
        
        if (err) {
            next(err);
            return;
        }

        context.data = rows

        // change out 0 for kg and 1 for lbs for the rendering
        for (i=0; i<rows.length; i ++) {
            if (rows[i].lbs == 0){
                rows[i].lbs = "kg"
            } 
            else if(rows[i].lbs == 1) {
                rows[i].lbs = "lbs"
            }
        }
        res.render("home", context);
    });
});


// Insert function -----------------------------
//  should happen on submit of form
app.get("/insert", function (req, res, next) {
    var context = {};
    // insert into my pool
    mysql.pool.query(
        'INSERT INTO workout (name, reps, weight, date, lbs) VALUES (?, ?, ?, ?, ?)',
        [
            req.query.name,
            req.query.reps,
            req.query.weight,
            req.query.date,
            req.query.lbs
        ],

        function (err, result) {
            if (err) {
                next(err);
                console.log("Error including")
                return;
            }
            // If properly inserted, add to database and render
            else {
                context.data = "Inserted new workout with id " + result.insertId;
                console.log("Successfully added row")
                res.render("home", context);
            }
        }
    );
});


// Remove function -----------------------------
app.get("/delete", function (req, res, next) {
    var context = {};
    mysql.pool.query(
        "DELETE FROM workout WHERE id=?",
        [req.query.id],
        function (err, result) {
            if (err) {
                next(err);
                return;
            }
            console.log("Successfully deleted row")
            res.render("home", context);
        }
    );
});

// Update function -----------------------------

// /update?id=1&name=The+Task&done=false

app.get("/update", function (req, res, next) {
    var context = {};
    mysql.pool.query(
        // get copy of current data
        "SELECT * FROM workout WHERE id=?",
        [req.query.id],
        function (err, result) {
            if (err) {
                next(err);
                return;
            }
            // if a row with that id exists
            if (result.length == 1) {
                // current data is whatever data is in BEFORE editing
                var currentData = result[0];
                // update the current data or use whatever data is already there
                mysql.pool.query(
                    "UPDATE workout SET name=?, reps=?, weight=?, date=?, lbs=? WHERE id=?",
                    [
                        req.query.name || currentData.name,
                        req.query.reps || currentData.reps,
                        req.query.weight || currentData.weight,
                        req.query.date || currentData.date,
                        req.query.lbs || currentData.lbs,
                        req.query.id
                    ],
                    function (err, result) {
                        if (err) {
                            next(err);
                            return;
                        }
                        // context.data = "Updated row" + result.changedRows + " rows.";
                        // res.render("home", context);
                    }
                );
            }
        }
    );
});

// given to us to remove data already inside
app.get("/reset-table", function (req, res, next) {
    var context = {};
    mysql.pool.query("DROP TABLE IF EXISTS workout", function (err) {
        //replace your connection pool with the your variable containing the connection pool
        var createString =
            "CREATE TABLE workout(" +
            "id INT PRIMARY KEY AUTO_INCREMENT," +
            "name VARCHAR(255) NOT NULL," +
            "reps INT," +
            "weight INT," +
            "date DATE," +
            "lbs BOOLEAN)";
        mysql.pool.query(createString, function (err) {
            context.results = "Table reset";
            res.render("home", context);
        });
    });
});

//  ------------------
app.use(function (req, res) {
    res.status(404);
    res.render("404");
});

app.use(function (err, req, res, next) {
    console.error(err.stack);
    res.status(500);
    res.render("500");
});

app.listen(app.get("port"), function () {
    console.log(
        "http://flip2.engr.oregonstate.edu:10292/" +
            app.get("port") +
            "; press Ctrl-C to terminate."
    );
});

