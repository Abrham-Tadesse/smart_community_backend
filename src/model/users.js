const mongoose = require("mongoose");
const validator = require("validator");


const userSchema = new mongoose.Schema({
       name : {
        type : String,
        required : true,
        trim : true
       },
       email : {
        type : String,
        required : true,
        trim : true,
        unique : true,
        validate(value){
         if(!validator.isEmail(value)){
            throw new Error("Please insert an valid email");
             }
        }

       },
       phone : {
        type : String,
        required : true,
        match: [/^(?:\+251|0)?9\d{8}$/, "Invalid phone number"],
        trim : true,
       },
       password : {
        type : String,
        required : true,
        validate(value){
            if(value.length<6)
            {
             throw new Error("The password must contain atleast 6 characters");
            }
        }
       }



})


//  Creating vertual property to fetch issues created by the user 
userSchema.virtual("issue", {
    ref : "Issue",
    localField : "_id",
    foreignField : "creator"
})








const User = mongoose.model("User", userSchema);
module.exports = User;
