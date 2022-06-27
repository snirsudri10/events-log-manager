const express = require("express");
const router = express.Router();
const passport = require("passport");
const User = require("../models/user");
const middleWare = require("../middleware/index");


router.get("/signIn",(req,res)=>{
    res.render("userHandle/signIn");
});

router.post("/signIn",passport.authenticate("local",
   {successRedirect:"/",failureRedirect:"/userHandle/signIn"})//,failureFlash:true})
   ,function(req,res){}
);

router.get("/signUp",middleWare.isUserAndManager,(req,res)=>{
    res.render("userHandle/signUp");
});

router.post("/signUp",middleWare.isUserAndManager,(req,res)=>{
    var user = new User({username:req.body.user.username,accessLvl:req.body.user.accessLvl});

    User.register(user,req.body.user.password,function(err,user){
        if(err){
           console.log(err.message);
           //req.flash("error",err.message);
           return res.redirect("back");
        }
        //req.flash("success","בבקשה התחבר");
        console.log("successful registration");
        return res.redirect("/userHandle/viewUsers");
     });
});

router.get("/viewUsers",middleWare.isUserAndManager,(req,res)=>{
    User.find({},(err,users)=>{
        if(err){
            console.log(err.message);
            //req.flash("error",err.message);
            return res.redirect("back");
        }
        
        if(!users){
            req.flash("error","המשתמשים לא נמצאו");
            return res.redirect("back");
        }
        res.render("userHandle/usersManager",{users:users});
    });
});

router.get("/logout",middleWare.isLoggedIn,function(req,res){
    req.logOut(); //logging out
    res.redirect("/userHandle/signIn");
});

router.get("/editUser/:id",middleWare.isUserAndManager,(req,res)=>{
    User.findById(req.params.id,(err,user)=>{
        if(err){
            console.log(err.message);
            //req.flash("error",err.message);
            return res.redirect("back");
        }
        res.render("userHandle/edit",{user:user});
    });
});


router.put("/editUser/:id",middleWare.isUserAndManager,(req,res)=>{
    User.findByIdAndUpdate(req.params.id,req.body.user,(err,user)=>{
       if(err){
          req.flash("error",err.message);
          console.log(err.message);
          return res.redirect("back");
       }
       user.save();
       console.log("success");
       return res.redirect("/userHandle/viewUsers");
    });
});

router.delete("/deleteUser/:id",middleWare.isUserAndManager,(req,res)=>{
    var occoured = false;
    if(req.user.id === req.params.id){
       //req.flash("error","משתמש לא יכול למחוק את עצמו");
       console.log("error manager delete himself");
       occoured=true;
       return res.redirect("back");
    }
    User.findById(req.params.id,(err,foundUser)=>{
       if(err){
          //req.flash("error",err.message);
          console.log(err.message);
          occoured = true;
          return res.redirect("back");
       }
       if(foundUser.accessLvl === 1 && req.user.accessLvl === 1){
          console.log("delete other manager");
          //req.flash("error","מנהל לא יוכל למחוק מנהלים אחרים");
          occoured = true;
          return res.redirect("back");
       }else{
          User.findByIdAndDelete(req.params.id,(err,user)=>{
             if(err){
                console.log(err.message);
                //req.flash("error",err.message);
                return res.redirect("back");
            }
            //req.flash("success","המשתמש נמחק בהצלחה");
            console.log("successful delete");
            return res.redirect("back");
          });
       }
    });
});

module.exports = router;