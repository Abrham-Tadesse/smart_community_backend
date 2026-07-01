const express = require("express");
const router = new express.Router();
const User = require("../model/users");
const Issue = require("../model/issue");
const auth = require("../middleware/auth");
const admin = require("../middleware/admin");


router.get("/admin/users", auth, admin, async (req, res) => {
     try {
    const users = await User.find();
    res.status(200).send(users);
  } catch (e) {
    res.status(401).send(e);
  }
})

router.patch("/admin/users/:id/role",auth, admin, async(req,res)=>{
    try{
      // promote or demote a role for users 
    }catch(e){
        res.status(401).send(e)
    }
})

router.get("/admin/issues",auth, admin, async(req, res)=>{
    try{
   const issues = await Issues.find().populate("creator", "name email");
   res.status(200).send(issues);
   
    }catch(e){
        res.status(401).send(e);
    }
})










module.exports = router;