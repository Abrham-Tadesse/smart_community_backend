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
        res.status(400).send("You face " + e + " error");
       }
  })
// Login a user 
    router.post("/users/login",async(req,res)=>{
      try{
         const user = User.findByCredential(req.body.email, req.body.password);
         const token = user.generateAuthTokens();
         res.send({user,token});
      }catch(e){
         res.status(400).send("please try again");

      }
    })
// Log out the user 
      router.post("/users/logout",async(req,res)=>{
         try{
         req.user.tokens = req.user.tokens.filter((token)=>{
         return token.token !== req.token;

      })
         }catch(e){
        res.status(400).send();
         }
      })


  module.exports = router;