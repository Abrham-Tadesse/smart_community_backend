const express = require("express");
const Issue = require("../model/issue");
const router = express.Router();
const auth = require("../middleware/auth");


// Creating an issue
router.post("/issue",async (req,res)=>{
    try{
        const issue = new Issue({...req.body,owner : req.body._id});
        await issue.save();
        res.status(201).send(issue);

    }catch(e){
        res.status(401).send();
    }

})
// Reading(accessing) issues

router.get("/issue",auth,async (req,res)=>{
    try{
        const issues = Issue.find({owner : req.user._id});
        res.status(200).send(issues)
    }catch(e){
        res.status(401).send();
    }

})

// updating the report

router.patch("/reports/:id", auth, async (req, res) => {
  const updates = Object.keys(req.body);
  const allowedUpdates = ["title", "description", "status"]; // fields you allow
  const isValidOperation = updates.every((update) =>
    allowedUpdates.includes(update)
  );
  if (!isValidOperation) {
    return res.status(400).send({ error: "Invalid updates!" });
  }
  try {
    const report = await Report.findOne({
      _id: req.params.id,
      owner: req.user._id   // ensures user owns the report
    });
    if (!report) {
      return res.status(404).send();
    }
    updates.forEach((update) => (report[update] = req.body[update]));
    await report.save();
    res.send(report);
  } catch (e) {
    res.status(400).send(e);
  }
});

//Deleting an Issue 

router.delete("/reports/:id", auth, async (req, res) => {
  try {
    const report = await Report.findOneAndDelete({
      _id: req.params.id,
      owner: req.user._id   // only owner can delete
    });

    if (!report) {
      return res.status(404).send();
    }

    res.send(report);
  } catch (e) {
    res.status(500).send();
  }
});