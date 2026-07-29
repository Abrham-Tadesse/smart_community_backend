const express = require("express");
const Comment = require("../model/comments");
const auth = require("../middleware/auth");
const router = express.Router();
const mongoose = require("mongoose");
const Activity = require("../model/activities");



// Creating a comment 
router.post("/issues/:issueId/comments",auth,async(req,res)=>{
  try{
   const comment = await new Comment({
    ...req.body,
     issue : req.params.issueId,
     user : req.user._id
   });
   await comment.save();

       await Activity.create({
       type: "comment",
       message: `${req.user.name} commented on an issue`,
       user: req.user._id,
       issue: req.params.id,
       comment : comment._id
   });

   res.status(201).send(comment);
  }catch(e){
    res.status(400).send();
  }
})


// Reading the comment in an issue;

router.get("/issues/:issueId/comments", async (req, res) => {
  try {
    console.log("route hit");

    if (!mongoose.Types.ObjectId.isValid(req.params.issueId)) {
      return res.status(400).send({ error: "Invalid issue ID" });
    }

    const comments = await Comment.find({
      issue: req.params.issueId
    }).populate("user", "name email");

    res.send(comments); 
  } catch (e) {
    console.log(e);
    res.status(500).send(e.message);
  }
});








   module.exports = router;