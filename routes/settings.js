const express = require("express");
const middlewareObj = require("../middleware/index");
const router = express.Router();
const Settings = require("../models/settings");
const methodOverride = require("method-override");

router.get("/",middlewareObj.isUserAndManager,(req,res)=>{
    Settings.find({},(err,systemSettings)=>{
        if(err){
            req.flash("error",err.message);
            return res.redirect("back");
        }
        if(systemSettings[0] != undefined){
            console.log(systemSettings[0]);
            req.flash("success","ההגדרות נמצאו");
            res.render("systemSettings/index",{systemSettings:systemSettings[0],success:req.flash()});
        }else{
            Settings.create({
                departments:[],
                people:[],
                colors:[],
                darkMode:true
            },(err,systemSettings)=>{
                if(err){
                    req.flash("error",err.message)
                    return res.redirect("back");
                }
                console.log("creating system settings");
                
                req.flash("success","ההגדרות נוצרו בהצלחה");
                systemSettings.save();
                res.render("systemSettings/index",{systemSettings:systemSettings});
            });
        }
    });
});

router.post("/addDepartment",(req,res)=>{
    console.log(req.body.dept);
    Settings.find({},(err,systemSettings)=>{
        if(err){
            res.locals.error = err.message;
            return res.redirect("back");
        }
        if(systemSettings){
            console.log(systemSettings[0]);
            systemSettings[0].departments.push(req.body.dept);
            systemSettings[0].save()
            res.redirect("back");
        }else{
            res.locals.error = "הגדרות המערכת לא נמצאו";
            res.redirect("back");
        }
    });
});

router.delete("/deleteDepartment/:name",(req,res)=>{
    console.log(req.params.name);
    Settings.find({},(err,systemSettings)=>{
        if(err){
            res.locals.error = err.message;
            return res.redirect("back");
        }
        if(systemSettings){
            for( let i = 0; i < systemSettings[0].departments.length; i++){ 

                if ( systemSettings[0].departments[i] === req.params.name) { 
                    systemSettings[0].departments.splice(i, 1); 
                }
            }
            systemSettings[0].save()
            res.redirect("back");
        }else{
            res.locals.error = "הגדרות המערכת לא נמצאו";
            res.redirect("back");
        }
    });
});

router.post("/addPeople",(req,res)=>{
    console.log(req.body.people);
    Settings.find({},(err,systemSettings)=>{
        if(err){
            req.flash("error",err.message);
            return res.redirect("back");
        }
        if(systemSettings){
            console.log(systemSettings[0]);
            systemSettings[0].people.push(req.body.people);
            systemSettings[0].save();
            res.redirect("back");
        }else{
            res.locals.error = "הגדרות המערכת לא נמצאו";
            res.redirect("back");
        }
    });
});


router.delete("/deletePeople/:people",(req,res)=>{
    console.log(req.params.people);
    Settings.find({},(err,systemSettings)=>{
        if(err){
            req.flash("error",err.message);
            return res.redirect("back");
        }
        if(systemSettings){
            for( let j = 0; j < systemSettings[0].people.length; j++){ 
                if ( systemSettings[0].people[j] === req.params.people) {
                    systemSettings[0].people.splice(j, 1);
                }
            }
            systemSettings[0].save();
            res.redirect("back");
        }else{
            req.flash("error","הגדרות המערכת לא נמצאו");
            res.redirect("back");
        }
    });
});

router.post("/addColor",(req,res)=>{
    console.log(req.body.color);
    Settings.find({},(err,systemSettings)=>{
        if(err){
            req.flash("error",err.message);
            return res.redirect("back");
        }
        if(systemSettings){
            console.log(systemSettings[0]);
            systemSettings[0].colors.push(req.body.color);
            systemSettings[0].save();
            res.redirect("back");
        }else{
            res.locals.error = "הגדרות המערכת לא נמצאו";
            res.redirect("back");
        }
    });
});

router.delete("/deleteColor/:color",(req,res)=>{
    req.params.color = "#"+req.params.color;
    Settings.find({},(err,systemSettings)=>{
        if(err){
            req.flash("error",err.message);
            return res.redirect("back");
        }
        if(systemSettings){
            for( let j = 0; j < systemSettings[0].colors.length; j++){ 
                if ( systemSettings[0].colors[j] === req.params.color) {
                    systemSettings[0].colors.splice(j, 1);
                }
            }
            systemSettings[0].save();
            res.redirect("back");
        }else{
            req.flash("error","הגדרות המערכת לא נמצאו");
            res.redirect("back");
        }
    });
});

router.post("/darkMode",(req,res)=>{
    console.log(req.body.darkMode);
    if(req.body.darkMode == "true"){
        req.body.darkMode = true;
    }else{
        req.body.darkMode = false;
    }

    Settings.find({},(err,systemSettings)=>{
        if(err){
            req.flash("error",err.message);
            return res.redirect("back");
        }
        if(systemSettings){
            console.log(systemSettings[0]);
            systemSettings[0].darkMode = req.body.darkMode
            systemSettings[0].save();
            res.redirect("back");
        }else{
            res.locals.error = "הגדרות המערכת לא נמצאו";
            res.redirect("back");
        }
    });
});

module.exports = router;