//jshint esversion:6

// default modules
const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const _ = require("lodash");

//custom modules
// const date = require(__dirname + "/date.js");

// Global Variables

app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));
//////////////////////////////////////////////////////
// USERNAME / PASSWORD EXCLUDED FOR SECURITY PURPOSES
//////////////////////////////////////////////////////
mongoose.connect("mongodb+srv://U:P@cluster0-dom0m.mongodb.net/toDoListDB", {useNewUrlParser: true , useUnifiedTopology: true });
mongoose.set("useFindAndModify", false);
////////////////////////////////// DB /////////////////////////////////////
// Here Schema: itemsSchema, Model: Item, Collection/ Table: items (auto generation by Model- Item -> items), Documents/ Rows: defaultItems (3)
// Schema
const itemsSchema = {
  name: String
};

// Model
const Item = mongoose.model("Item", itemsSchema);

// Documents
const item1 = new Item({
  name: "Welcome to your To Do List!"
});
const item2 = new Item({
  name: "Click on the + icon to add items."
});
const item3 = new Item({
  name: "Click on the checkbox to delete an item."
});

const defaultItems = [item1, item2, item3];

// For Custom Lists
// Schema
const listSchema = {
  name: String,
  items: [itemsSchema]
};

// Model
const List = mongoose.model("List", listSchema);



///////////////////////////////////////// END DB /////////////////////////////////////////

// root route
app.get("/", function (req, res) {
  // let day = date.getDate();
  Item.find({}, function(err, foundItems) {
    if(err)
      console.log(err);
    else {
        // Insert Documents into Collection using Model
        if(foundItems.length === 0) {
          Item.insertMany(defaultItems, function(err) {
            if(err)
              console.log("err", err);
            else
              console.log("Successfully added default list.");
          });
        }
        res.render("list", {
        listTitle: "Today",
        listItems: foundItems,
      });
    }
  });
  
});

app.post("/", function (req, res) {
  const itemName = req.body.newItem;
  const listName = req.body.listButton;
  if (itemName != "") {
    const item = new Item({
      name: itemName
    });
    if(listName === "Today") {
        item.save();
        res.redirect("/");
      
    } else {
      List.findOne({name: listName}, function(err, foundList) {
        if(!err) {
          foundList.items.push(item);
          foundList.save();
          res.redirect("/" + listName);
        }
      });
    }
  }
});
// Delete Item
app.post("/delete", function(req, res) {
  const checkedItemId = req.body.itemCheckbox;
  const listName = req.body.listName;
  if(listName === "Today") {
    Item.findByIdAndRemove(checkedItemId, function(err) {
      if(err)
        console.log("err", err);
      else
        console.log("Successfully deleted item.");
        res.redirect("/");
    });
  } else {
    List.findOneAndUpdate({name: listName}, {$pull: {items: {_id: checkedItemId}}}, {useFindAndModify: false}, function(err, results){
      if(!err) 
        res.redirect("/" + listName);
    });
  }
  
});

// Custom List Routes
app.get("/:newList", function(req, res) {
  const listName = _.capitalize(req.params.newList);
  List.findOne({name: listName}, function(err, foundList) {
    if(!err) {
      if(foundList) {
        // Show the list
        res.render("list", {
          listTitle: foundList.name,
          listItems: foundList.items
        });
      } else {
        // Create new list Document
        const list = new List({
          name: listName,
          items: defaultItems
        });
        list.save();
        res.redirect("/"+listName);
      }
    }
  });
  
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

let port = process.env.PORT;
if(port == null || port == "") {
  port = 3000;
}
app.listen(port || 3000, function () {
  console.log("Server has started successfully.");
});
