const jwt = require("jsonwebtoken");
const User = require("../model/users");

const auth = async(req,res,next)=>{
   try{
    const header = req.header("Authorization");
    if(!header) {
        res.status(400).send("No header is fouund");
    }
    const token = header.replace("Bearer ","");
    const decoded = jwt.verify(token,process.env.JWT_SECRETE);
    const user = await User.findOne({_id : decoded._id, "tokens.token" : token});
    if(!user){
        throw new Error("User is not foound");
    }
    req.user = user;
    req.token = token;

    next();

   }catch(e){
    res.status(401).send("Please authenticate yourself");
   }

}


module.exports = auth;