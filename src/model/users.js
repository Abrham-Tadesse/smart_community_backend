const mongoose = require("mongoose");
const validator = require("validator");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");


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
       },
       tokens : [{
        token : {
            type : String,
            required : true
        } 
       }]


})


//  Creating vertual property to fetch issues created by the user 
userSchema.virtual("issue", {
    ref : "Issue",
    localField : "_id",
    foreignField : "creator"
})

userSchema.pre("save", async function(){
    const user = this;
    if(user.isModified("password")){
        const hashedPassword = await bcrypt.hash(user.password , 10);
        user.password = hashedPassword;
    }
})

userSchema.methods.generateAuthTokens = async function(){
    const user = this;
    const token = jwt.sign({_id : user._id.toString()},process.env.JWT_SECRETE);
    user.tokens = user.tokens.concat({token});
    await user.save();

    return token;
}

userSchema.statics.findByCredential = async function(email,password){
      const user = await User.findOne({email});
      if(!user){
        throw new Error("Invalid email or password");
      }
      const isMatch = await bcrypt.compare(password,user.password);
      if(!isMatch){
        throw new Error("Invalid email or password");
      }
      return user;
}




const User = mongoose.model("User", userSchema);
module.exports = User;
