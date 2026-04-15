const express = require("express");
const router = new express.Router();
const User = require("../model/users");

// Register the user
  router.post("/users", (req,res)=>{
       try{
        const user = new User(req.body);
        user.save();
        res.status(201).send(user);

       }catch(e){
        if(e.code === 1100){
           res.status(400).send("The email is already exist ");
        }
        res.status(400).send("You face " + e + "error");
       }
  })
