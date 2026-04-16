const express = require("express");
const router = new express.Router();
const User = require("../model/users");


// Register the user
  router.post("/users", async(req,res)=>{
       try{
        const user = new User(req.body); 
        await user.save();
        const token = await user.generateAuthTokens();
        res.status(201).send({user,token});

       }catch(e){
        if(e.code === 1100){
           res.status(400).send("The email is already exist ");
        }
        res.status(400).send("You face " + e + "error");
       }
  })



  module.exports = router;