const express = require("express");
const router = new express.Router();
const User = require("../model/users");
const auth = require("../middleware/auth");


// Register the user
  router.post("/", async(req,res)=>{
       try{
            const existingUser = await User.findOne({ email: req.body.email });

            if (existingUser) {
               return res.status(400).send("Email already exists");
            }
        const user = new User(req.body); 
        await user.save();
        const token = await user.generateAuthTokens();
        res.status(201).send({user,token});

       }catch(e){
        if(e.code === 11000){
           res.status(400).send("The email is already exist ");
        }
        res.status(400).send(e.message);
       }
  })
// Login a user 
    router.post("/login",async(req,res)=>{
      try{
         const user = await User.findByCredential(req.body.email, req.body.password);
         const token = await user.generateAuthTokens();
         res.send({user,token});
      }catch(e){
         res.status(400).send("please try again" + e);

      }
    })
// Log out the user 
      router.post("/logout",async(req,res)=>{
         try{
         req.user.tokens = req.user.tokens.filter((token)=>{
         return token.token !== req.token;
      })
      req.user.save();
      res.status(200).send("You logedout successfully");
         }catch(e){
        res.status(400).send();
         }
      })
// Update profile
   router.patch("/me",auth, async(req,res)=>{
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
// Logout all sessions 
   
 router.post("/logoutall",auth , async(req,res)=>{
    try{
      req.user.tokens = [];
     await req.user.save();

    res.status(200).send("You logged out successfully");
   }catch(e){
      res.status(500).send();
   }
 })
// ACCESSING A USERS
        router.get("/me",auth, async(req,res) => {
            try{
           res.send(req.user);

            }catch(e){
                res.status(500).send("internal server error");
            }
        })

//ACCESSING SINGLE USER
        router.get("/:id", async (req,res)=>{
            const _id = req.params.id;
            try{
                const user = await User.findById(_id);
                if(!user){
                    return res.status(404).send();

                }
                res.status(200).send(user);

            }catch(e){
                res.status(500).send();

            }
        })

//DELETING A USER
       router.delete("/me",auth, async(req,res)=>{
          try{
          await req.user.deleteOne();
           res.send(req.user);

          }catch(e){
            res.status(500).send("you do not delete the account");
          }
       })
      






  module.exports = router;