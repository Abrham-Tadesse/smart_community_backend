const express = require("express");
const Comment = require("../model/comments");
const auth = require("../middleware/auth");
const router = express.Router();




// Creating a comment 
router.post("/issues/:id/comments",auth,async(req,res)=>{
  try{
   const comment = await new Commenet({
    ...req.body,
     issue : req.params.id,
     user : req.user._id
   });
   comment.save();
   res.status(201).send(comment);
  }catch(e){
    res.status(401).send();
  }
})


// Reading the comment in an issue
   router.get("/issues/:id/comments",async(req,res)=>{
    try {
      const comment = await Comment.find({issue:req.params.id}).populate("owner").populate("owner","name email");
      res.send(comment);

    }catch(e){
      res.status(500).send();
    }
   })








   module.exports = router;
   