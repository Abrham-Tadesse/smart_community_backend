const User = require('../model/users');

const admin = (req,res,next)=>{
    if(!eq.user.role !== 'admin'){
        res.status(403).send({error : "access deniad"});
    }

    next();
}


module.exports = admin;