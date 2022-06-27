let middlewareObj ={}


middlewareObj.isLoggedIn = (req,res,next)=>{
    if(req.isAuthenticated()){
        return next();
    }
    req.flash("error","אין משתמש מחובר");
    // console.log("user is not connected")
    return res.redirect("/userHandle/signIn");
}

middlewareObj.isUserAndManager = (req,res,next)=>{
    if(req.user && req.user.accessLvl < 2){
        return next();
    }
    console.log("user is not manager")
    req.flash("error","למשתמש זה לא קיימות הרשאות מנהל");
    res.redirect("/");
}

middlewareObj.isUserAndMetis = (req,res,next)=>{
    if(req.user && req.user.accessLvl <= 2){
        return next();
    }
    //req.flash("error","אין לך הרשאות");
    console.log("user is not metis");
    res.redirect("/");
}



module.exports = middlewareObj;