const jwt = require("jsonwebtoken");
const User = require("../model/users");

const auth = async(req,res,next)=>{
   try{
    const header = req.header("Authorization");
    if(!header) {
        res.status(400).send("No header is found");
    }
    const token = header.replace("Bearer ","");
    // console.log("TOKEN:", token);
    const decoded = jwt.verify(token,process.env.JWT_SECRETE);
    // console.log("decoded:", decoded);
    const user = await User.findOne({_id : decoded._id, "tokens.token" : token});
    // console.log("User found" + user);
    if(!user){
        throw new Error("User is not found");
    }
    req.user = user;
    req.token = token;

    next();

   }catch(e){
    res.status(401).send(e.message);
   }

}


module.exports = auth;