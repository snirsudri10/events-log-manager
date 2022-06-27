const mongoose = require("mongoose");

const settings = mongoose.Schema({
    departments:[String],
    people:[String],
    colors:[String],
    darkMode:Boolean
});

module.exports = mongoose.model("Settings",settings);