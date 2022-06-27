const mongoose = require("mongoose");

const temp = mongoose.Schema({
    title:String,
    from:String,
    to:String,
    body:String,
    state:String,
    dayClosure: Boolean,
    color:String,
    profession:String,
});

module.exports = mongoose.model("Temp",temp);