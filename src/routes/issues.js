const express = require("express");
const Issue = require("../model/issue");
const router = express.Router();
const auth = require("../middleware/auth");
const Comment = require('../model/comments');


// Creating an issue
router.post("/",auth,async (req,res)=>{
    try{
        const issue = new Issue({...req.body, creator : req.user._id});
        await issue.save();
        res.status(201).send(issue);

    }catch(e){
        res.status(401).send(e);
    }

})
// Reading(accessing) issues

router.get("/",auth,async (req,res)=>{
    try{
        const issues = await Issue.find({creator : req.user._id});
        res.status(200).send(issues)
    }catch(e){
        res.status(401).send(e);
    }

})

// updating the report

router.patch("/:id", auth, async (req, res) => {
  const updates = Object.keys(req.body);
  const allowedUpdates = ["title", "description", "category","affected", "location"]; // fields you allow
  const isValidOperation = updates.every((update) =>
    allowedUpdates.includes(update)
  );
  if (!isValidOperation) {
    return res.status(400).send({ error: "Invalid updates!" });
  }
  try {
    const issue = await Issue.findOne({
      _id: req.params.id,
      creator: req.user._id   // ensures user owns the report
    });
    if (!issue) {
      return res.status(404).send("no issue");
    }
    updates.forEach((update) => (issue[update] = req.body[update]));
    await issue.save();
    res.send(issue);
  } catch (e) {
    res.status(400).send(e.message);
  }
});

//Deleting an Issue 

router.delete("/:id", auth, async (req, res) => {
  try {
    const issue = await Issue.findOneAndDelete({
      _id: req.params.id,
      creator: req.user._id   // only owner can delete
    });

    if (!issue) {
      return res.status(404).send("error");
    }

    res.send(issue);
  } catch (e) {
    res.status(500).send();
  }
});

// Creating a comment 
router.post("/:id/comments",auth,async(req,res)=>{
  try{
   const comment = await new Comment({
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
   router.get("/:id/comments",async(req,res)=>{
    try {
      const comment = await Comment.find({issue:req.params.id}).populate("owner").populate("owner","name email");
      res.send(comment);

    }catch(e){
      res.status(500).send();
    }
   })



   


module.exports = router;