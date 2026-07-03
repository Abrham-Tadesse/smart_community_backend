const User = require('../model/users');

const admin = (req,res,next)=>{
try{    if(req.user.role !== 'admin'){
        res.status(403).send({error : "Access deniad"});
    }

    next();
}catch(e){
    res.status(500).send({error : "Server error", e : `${e}`});
}
}


module.exports = admin;