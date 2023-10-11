import express from "express";
import bodyParser from "body-parser";
import { dirname } from "path";
import { fileURLToPath } from "url";
import mongoose from "mongoose";
import _ from "lodash";

const __dirname = dirname(fileURLToPath(import.meta.url));
const app = express();
const port = 3000;
const mytasks = [{ name: "taskName", isChecked: false }];
const worktasks = [{ name: "taskName", isChecked: false }];

const d = new Date();
const date = d.getDate();
const month = d.getMonth();
const year = d.getFullYear();
var monthStr;
if (month === 0) {
    monthStr = "January";
}
if (month === 1) {
    monthStr = "February";
}
if (month === 2) {
    monthStr = "March";
}
if (month === 3) {
    monthStr = "April";
}
if (month === 4) {
    monthStr = "May";
}
if (month === 5) {
    monthStr = "June";
}
if (month === 6) {
    monthStr = "July";
}
if (month === 7) {
    monthStr = "August";
}
if (month === 8) {
    monthStr = "September";
}
if (month === 9) {
    monthStr = "October";
}
if (month === 10) {
    monthStr = "November";
}
if (month === 11) {
    monthStr = "December";
}

const heading=date+" " + monthStr + " " +year;

mongoose.connect("mongodb://0.0.0.0:27017/todolistDB");

const itemsSchema = new mongoose.Schema({
    name: String,
})

const Item = mongoose.model('Item', itemsSchema);

const item1 = new Item({
    name: "Welcome to your to do list",
})

const item2 = new Item({
    name: "Hit the button to add a new item",
})

const item3 = new Item({
    name: "Hit button to delete a item",
})

const defaultItems = [item1, item2, item3];

const listSchema = new mongoose.Schema({
    name: String,
    items: [itemsSchema],
});

const List = mongoose.model("List", listSchema);

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('public'));

app.post("/", (req, res) => {
    const taskName = req.body["tasks"];
    const listName=req.body["task"];
    const newItem = new Item({
        name: taskName,
    });
    if(listName===heading){
        newItem.save();
        res.redirect("/");
    }else{
        List.findOne({name: listName}).then(function(foundList){
            foundList.items.push(newItem);
            foundList.save();
            res.redirect("/" + listName);
        })
        .catch(function(err){
            console.log(err);
        })

    }
    
});

app.post("/delete", (req, res) => {
    const checkItemId = req.body["checkItem"];
    const listName=req.body["listName"];
    if(listName===heading)
    {
        Item.findByIdAndRemove(checkItemId).then(result => {
            console.log(result);
        })
            .catch(err => {
                console.log(err);
            })
        res.redirect("/");
    }else{
        List.findOneAndUpdate({name: listName} , {$pull: {items : {_id: checkItemId}}}).then(function(foundList){
            res.redirect("/" + listName);
        })
        .catch(function(err){
            console.log(err);
        })
    }
    
})

app.get('/', (req, res) => {
    Item.find({}).then(function (foundItems) {
        if (foundItems.length === 0) Item.insertMany(defaultItems);
        res.render("index.ejs", { pageHeading: heading, yourTasks: foundItems });
    })
        .catch(function (err) {
            console.log(err);
        })

});

app.get('/:customListName', async (req, res) => {
    const customListName = _.capitalize(req.params.customListName);
    List.findOne({ name: customListName }).then(function (foundList) {
        if (!foundList) {
            const list = new List({
                name: customListName,
                items: defaultItems,
            });
            list.save();
            res.redirect("/" + customListName);
        }
        else {
            res.render("index.ejs", {pageHeading: customListName, yourTasks: foundList.items });
        }
    })
        .catch(function (err) {
            console.log(err);
        })

})

app.listen(port, () => {
    console.log(`The app is active on port ${port}`);
});