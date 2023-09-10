import express from "express";
import bodyParser from "body-parser";
import { dirname } from "path";
import { fileURLToPath } from "url";

const __dirname=dirname(fileURLToPath(import.meta.url));
const app=express();
const port=3000;
const mytasks=[{name: "taskName", isChecked:false}];
const worktasks=[{name: "taskName", isChecked:false}];

app.use(bodyParser.urlencoded({ extended: true}));
app.use(express.static('public'));

app.post("/createMyTask",(req,res) =>{
    const taskName=req.body["tasks"];
    mytasks.push({name: taskName, isChecked:false});
    res.render("index.ejs",{yourTasks:mytasks});
});

app.post("/createWorkTask",(req,res) =>{
    const taskName=req.body["tasks"];
    worktasks.push({name: taskName, isChecked:false});
    res.render("worklist.ejs",{workTasks:worktasks});
});

app.post("/yourList",(req,res) =>{
    res.render("index.ejs",{yourTasks:mytasks});
});

app.post("/yourAllList",(req,res) =>{
    res.render("allTask.ejs",{yourTasks:mytasks});
});

app.post("/workList",(req,res) =>{
    res.render("worklist.ejs",{workTasks:worktasks});
});

app.post("/workAllList",(req,res) =>{
    res.render("workAllTasks.ejs",{workTasks:worktasks});
});

app.get('/',(req,res)=>{
    res.render("index.ejs",{yourTasks:mytasks});
});

app.get('/allTask',(req,res)=>{
    const taskName=req.body["tasks"];
    res.render("allTask.ejs",{yourTasks:mytasks});
});

app.listen(port,()=>{
    console.log(`The app is active on port ${port}`);
});