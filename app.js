//jshint esversion:6

const express = require("express");
const bodyParser = require("body-parser");

const mongoose = require("mongoose");
const e = require("express");

const app = express();
const port = process.env.PORT || 3000
//connecting to mongoose database on localhost
mongoose.connect("mongodb+srv://admin-nitin:X3VaTizh8EAk4c2@cluster0.4wnzg.mongodb.net/myFirstDatabase?retryWrites=true&w=majority",{useNewUrlParser:true})
//creating a schema for the data 

const itemsSchema = new mongoose.Schema({
  name:{
    type:String,
   
  }
})

const Item = new mongoose.model("Item",itemsSchema);

const buyFood = new Item({
  name:"Buy Food"
})
const cookFood = new Item({
  name:"Cook Food"
})
const eatFood = new Item({
  name:"Eat Food"
})

const defaultItems = [buyFood,cookFood,eatFood]

const listSchema = {
  name:String,
  items:[itemsSchema]

  
}

const List = new mongoose.model("List", listSchema)
// Item.insertMany(defaultItems,function(err){
//   if(err) {
//     console.log("there is an error")
//   } else {
//     console.log("Succesfuly saved the DB")
//   }
// })


app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));

app.get("/", function(req, res) {
  Item.find({},function(err,foundItems){
  if(defaultItems.length == 0 ) {
    Item.insertMany({defaultItems},function(err){
      if(err) {
        console.log("there is an error")
      } else {
        console.log("Successfully saved the data!")
      }
    });
    res.redirect("/");
  } else { 
     res.render("list", {listTitle: "Today", newListItems:foundItems});
    }
  })
});

app.get("/:path",function(req,res){
  let url = req.params.path

  const list = new List({
    name:url,
    items:defaultItems,
  })
 list.save();
})


app.post("/", function(req, res){
  const itemName = req.body.newItem;
  const item = new Item({
    name:`${itemName}`
  })
  item.save();
  res.redirect("/")
});

app.post("/delete",function(req,res){
  const checkedItemId = req.body.checkbox
 Item.findByIdAndDelete(checkedItemId,function(err){
   if(!err) {
     console.log("successfully deleted the loged item!!")
     res.redirect("/")
   }
 })
})





app.get("/about", function(req, res){
  res.render("about");
});

app.listen(port, function() {
  console.log("Server started on port 3000");
});


// X3VaTizh8EAk4c2 database password of mongoDB  
// username - admin-nitin
// you can add a tel attribute in html for the navbar for marking direct calls 