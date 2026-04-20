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

