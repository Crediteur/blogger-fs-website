const express = require("express");
const app = express();
const port = 3000;
const sqlite3 = require("sqlite3").verbose();
const bodyParser = require("body-parser");

// config body parser to deal with JSON post bodies
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

//set the app to use ejs for rendering
app.set("view engine", "ejs");

//items in the global namespace are accessible through out the node application
global.db = new sqlite3.Database("./database.db", function (err) {
  if (err) {
    console.error(err);
    process.exit(1); //Bail out we can't connect to the DB
  } else {
    console.log("Database connected");
    global.db.run("PRAGMA foreign_keys=ON"); //This tells SQLite to pay attention to foreign key constraints
  }
});

//let express use files from public folder
app.use(express.static("public"));

const main_routes = require("./routes/main.js");
const user_routes = require("./routes/user.js");

//this adds all the userRoutes to the app under the path /user
app.use("/main", main_routes);
app.use("/user", user_routes);

//default homepage
app.get("/", (req, res) => {
  res.redirect("/main");
});

app.listen(port, () => {
  console.log(`Listening on port ${port}`);
});
