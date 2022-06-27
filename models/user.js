const mongoose = require("mongoose");
const passportLocalMongoose = require("passport-local-mongoose");

const UserSchema = new mongoose.Schema({
    username: {type:String,unique:true},
    password: String,
    accessLvl: Number,
});

UserSchema.plugin(passportLocalMongoose);
module.exports = mongoose.model("User",UserSchema);