const mongoose = require("mongoose");

const info = mongoose.Schema({
    name:String,
    date:String,
    time:String,
    from:String,
    to:String,
    body:String,
    state:String,
    dayClosure: Boolean,
    color:String,
    profession:String,
    addedBy:String
});

module.exports = mongoose.model("Info",info);