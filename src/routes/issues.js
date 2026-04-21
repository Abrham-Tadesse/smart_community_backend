const express = require("express");
const Issue = require("../model/issue");
const router = express.Router();
const auth = require("../middleware/auth");


// Creating an issue
router.post("/issues",auth,async (req,res)=>{
    try{
        const issue = new Issue({...req.body, creator : req.user._id});
        await issue.save();
        res.status(201).send(issue);

    }catch(e){
        res.status(401).send(e);
    }

})
// Reading(accessing) issues

router.get("/issues",auth,async (req,res)=>{
    try{
        const issues = await Issue.find({creator : req.user._id});
        res.status(200).send(issues)
    }catch(e){
        res.status(401).send(e);
    }

})

// updating the report

router.patch("/issues/:id", auth, async (req, res) => {
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

router.delete("/issues/:id", auth, async (req, res) => {
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




module.exports = router;