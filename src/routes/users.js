const express = require("express");
const router = new express.Router();
const User = require("../model/users");
const auth = require("../middleware/auth");


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
         const user = await User.findByCredential(req.body.email, req.body.password);
         const token = await user.generateAuthTokens();
         res.send({user,token});
      }catch(e){
         res.status(400).send("please try again" + e);

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
// Update profile
   router.patch("/users/me",auth, async(req,res)=>{
      const updates = Object.keys(req.body);
      const allowedUpdates = ["name","email","password"];
      const isAllowed = updates.every((update)=>allowedUpdates.includes(update));
      const user = req.user;
      if(!isAllowed) {
         res.status(400).send("You can`t update some values please check and try again");
      }
      try{
         updates.forEach((update)=>{
            user[update] = req.body[update];
         })
         await user.save();
         res.send(user);
      }catch(e){
       res.status(400).send();
      }
   })

      






  module.exports = router;