var express = require("express");
const middlewareObj = require("../middleware/index");
var router = express.Router();
var middleWare = require("../middleware/index");
var template = require("../models/template.js");

router.get("/addTemp",middlewareObj.isUserAndManager,(req,res)=>{
    res.render("templates/add");
});

router.post("/addTemp",middlewareObj.isUserAndManager,(req,res)=>{
    if(req.body.temp.dayClosure === "yes"){
        req.body.temp.dayClosure = true;
    }else{
        req.body.temp.dayClosure = false;
    }
    template.create(req.body.temp,(err,temp)=>{
        if(err){
            console.log(err.message);
            return res.redirect("back");
        }
        console.log(temp);
        res.redirect("/");
    });
});

router.get("/manageTemps",middlewareObj.isUserAndManager,(req,res)=>{
    template.find({},(err,temps)=>{
        if(err){
            console.log(err.message);
            return res.redirect("back");
        }
        res.render("templates/manage",{temps:temps});

    });
});

router.get("/editTemp/:id",middlewareObj.isUserAndManager,(req,res)=>{
    template.findById(req.params.id,(err,temp)=>{
        if(err){
            console.log(err.message);
            return res.redirect("back");
        }
        
        res.render("templates/edit",{temp:temp});

    });
});

router.put("/editTemp/:id",middlewareObj.isUserAndManager,(req,res)=>{
    if(req.body.temp.dayClosure === "yes"){
        req.body.temp.dayClosure = true;
    }else{
        req.body.temp.dayClosure = false;
    }
    template.findByIdAndUpdate(req.params.id,req.body.temp,(err,temp)=>{
        if(err){
            console.log(err.message);
            return res.redirect("back");
        }
        res.redirect("/templates/manageTemps");
    });
});

router.delete("/deleteTemp/:id",middlewareObj.isUserAndManager,(req,res)=>{
    template.findByIdAndRemove(req.params.id,(err)=>{
        if(err){
            console.log(err.message);
            return res.redirect("back");
        }
        res.redirect("/templates/manageTemps");
    });
});

module.exports = router;