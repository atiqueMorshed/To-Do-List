//jshint esversion:6
const express = require("express");
const app = express();
const bodyParser = require("body-parser");


app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({extended:true}));
app.use(express.static("public"));

// Global Variables
let items = [];

app.get("/", function(req, res) {
    let date = new Date();
    let options = {
        weekday: "long",
        day: "numeric",
        month: "long"
    };
    let day = date.toLocaleDateString("en-US", options);
    
    res.render("list", {
        kindOfDay: day,
        listItems: items
    });
});

app.post("/", function(req, res) {
    let item = req.body.newItem;
    if(item != "")
        items.push(item);
    res.redirect("/");
});

app.listen(3000, function() {
    console.log("Server started on port 3000");
});