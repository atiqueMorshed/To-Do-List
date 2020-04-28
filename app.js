//jshint esversion:6

// default modules
const express = require("express");
const app = express();
const bodyParser = require("body-parser");

app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

// Global Variables
let items = [];
let workItems = [];

//custom modules
const date = require(__dirname + "/date.js");
// root route
app.get("/", function (req, res) {
  let day = date.getDate();
  res.render("list", {
    listTitle: day,
    listItems: items,
  });
});

app.post("/", function (req, res) {
  let item = req.body.newItem;
  if (item != "") {
    if (req.body.listButton === "Work") {
      workItems.push(item);
      res.redirect("/work");
    } else {
      items.push(item);
      res.redirect("/");
    }
  }
});

// work route
app.get("/work", function (req, res) {
  res.render("list", {
    listTitle: "Work List",
    listItems: workItems,
  });
});

app.post("/work", function (req, res) {
  let item = req.body.newItem;
  if (item != "") workItems.push(item);
  res.redirect("/work");
});

//about
app.get("/about", function (req, res) {
  res.render("about");
});

app.listen(3000, function () {
  console.log("Server started on port 3000");
});
