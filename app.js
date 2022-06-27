const express = require('express');
const app = express();
const server = require("http").createServer(app);
const io = require("socket.io")(server,{cors:{ origin: "*" }});
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const localStrategy = require("passport-local");
const passport = require("passport");
const methodOverride = require("method-override");
const flash = require("connect-flash");
const moment = require('moment');


const User = require("./models/user");
const temp = require("./models/template");
const info = require("./models/info.js");


const userHandle = require("./routes/userHandle");
const templates = require("./routes/templates");
const settings = require("./routes/settings");
const middlewareObj = require('./middleware');

var url = process.env.DATABASEURL || "mongodb://localhost:27017/Flight_Managment"
mongoose.connect(url ,{useNewUrlParser:true, useUnifiedTopology: true});

app.set("view engine","ejs");
app.use(bodyParser.urlencoded({extended:true}));
app.use(express.static("public"));
app.use(methodOverride("_method"));
app.use(flash());


//PASSPORT CONFIGURATION
app.use(require("express-session")({
  secret: "I Think Amikam Norkin Is basically The Best",
  resave: false,
  saveUninitialized: false
}));

app.use(passport.initialize());
app.use(passport.session());
passport.use(new localStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use(function(req,res,next){
  res.locals.currentUser = req.user;
  res.locals.error = req.flash("error");
  res.locals.success = req.flash("success");
  next();
});


app.use("/userHandle",userHandle);
app.use("/templates",templates);
app.use('/systemSettings',settings);

app.get("/",middlewareObj.isLoggedIn,(req,res)=>{
  var date = moment().local().format("DD/MM/YYYY");
  info.find({date:date},(err,infos)=>{
    if(err){
      console.log(err);
      return res.redirect("back");
    }
    temp.find({},(err,temps)=>{
      if(err){
        console.log(err);
        return res.redirect("back");
      }
      res.render("index",{infos:infos,search:false,moment:moment,temps:temps});
    });
  });
});


app.post("/search",middlewareObj.isLoggedIn,(req,res)=>{
  var todayDate =  moment().local().format("DD/MM/YYYY");
  var searchedDate =  moment(req.body.date).format("DD/MM/YYYY");
  if(searchedDate === todayDate){
    return res.redirect("/");
  }
  info.find({date:searchedDate},(err,infos)=>{
    if(err){
      console.log(err);
      return res.redirect("back");
    }
    res.render("index",{infos:infos,date:req.body.date,search:true,searchedDate:searchedDate,moment:moment});
  });
});

app.post("/searchText",middlewareObj.isLoggedIn,(req,res)=>{
  var textToSearch = req.body.textToSearch;
  var obj = {[req.body.whereToSearch]:{"$regex":textToSearch,"$options":"i"}};
  info.find({[req.body.whereToSearch]:{"$regex":textToSearch,"$options":"i"}},(err,infos)=>{
    if(err){
      console.log(err);
      return res.redirect("back");
    }
    return res.render("searchText",{infos:infos,search:true,moment:moment});
  });
});


app.post("/searchColor/:color/:day/:month/:year",middlewareObj.isLoggedIn,(req,res)=>{
  var date = req.params.day +"/"+req.params.month +"/"+req.params.year
  var color = "#"+req.params.color;
  info.find({date:date,color:color},(err,infos)=>{
    res.render("searchColor",{infos:infos});
  });
});

app.get("/edit/:id",middlewareObj.isUserAndMetis,(req,res)=>{
  info.findById(req.params.id,(err,info)=>{
    if(err){
      console.log(err);
      return res.redirect("back");
    }
    var date = info.date;
    res.render("editInfo",{info:info,date:date});
  });
});

app.put("/edit/:id",middlewareObj.isUserAndMetis,(req,res)=>{
  if(req.body.info.dayClosure === "yes"){
    req.body.info.dayClosure = true;
  }else{
    req.body.info.dayClosure = false;
  }
  info.findByIdAndUpdate(req.params.id,req.body.info,(err,foundInfo)=>{
    if(err){
      console.log(err);
      return res.redirect("back");
    }
    var todayDate =  moment().local().format("DD/MM/YYYY");
    if(foundInfo.date === todayDate){
      io.emit("update",foundInfo.date);
      return res.redirect("/");
    }else{
      info.find({date:foundInfo.date},(err,infos)=>{
        if(err){
          console.log(err);
          return res.redirect("back");
        }
        res.render("index",{infos:infos,date:req.body.date,search:true,searchedDate:foundInfo.date,moment:moment});
      });
    }
  });
});


app.post("/dayClosure",middlewareObj.isLoggedIn,(req,res)=>{
  var date = req.body.date;
  info.find({date:date,dayClosure:true},(err,infos)=>{
    if(err){
      console.log(err);
      return res.redirect("back");
    }
    res.render("dayClosure",{infos:infos});
  });
});


app.get("*",(req,res)=>{
  res.render("error");
});

const port = process.env.PORT || 3000;
server.listen(port,()=>{
  console.log("server started at:",port);
});

io.on("connection",(socket)=>{
  
  socket.on("append",(data)=>{


    info.create(data,(err,obj)=>{

      if(err){
        console.log(err.message);
        return res.redirect("back");
      }
      console.log(obj);
    
      obj.save();

      io.emit("append",obj);

    });
  });

  socket.on("update",(date)=>{
    io.emit("update",date);
  });



  socket.on("delete",(id)=>{

    info.findByIdAndDelete(id,(err)=>{
      if(err){
        console.log(err);
        return res.redirect("back");
      }
      io.emit("delete");
    });
  });
});

