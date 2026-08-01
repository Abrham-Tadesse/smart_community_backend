const express = require("express");
const router = new express.Router();
const User = require("../model/users");
const Issue = require("../model/issue");
const Comment = require("../model/comments");
const auth = require("../middleware/auth");
const admin = require("../middleware/admin");
const mongoose = require("mongoose");
const Notification = require("../model/notification");



// Get all users
router.get("/users", auth, admin, async (req, res) => {
  try {
    const users = await User.find().select("-password");
    res.status(200).send({users});
  } catch (e) {
    res.status(401).send(e);
  }
});

// change user role

router.patch("/users/:id/role", auth, admin, async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).send({
        message: "Invalid user id",
      });
    }
    const { newRole } = req.body;

    if (!["user", "admin"].includes(newRole)) {
      return res.status(400).send({
        message: "Invalid role",
      });
    }
    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).send({
        message: "User not found",
      });
    }

    user.role = newRole;

    await user.save();

// CREATING A NOTIFICATION
    await Notification.create({
      recipient : user._id,
      message : `Your role is changed to ${user.role}`,
      type : "status_changed"
    })


    res.send({
      message: "Role updated successfully",
      user,
    });
  } catch (e) {
    res.status(500).send({
      message: e.message,
    });
  }
});

//CHANGE users status

router.patch("/users/:id", auth, admin, async (req, res) => {
  // console.log("route hit from the change status");
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).send({
        message: "Invalid user id",
      });
    }
    const {newStatus} = req.body;
     console.log(req.body);
    console.log(newStatus);

    if(!["active", "disabled"].includes(newStatus)){
       return res.status(400).send({
        message : "Invalid status"
       });
    }
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).send({
        message: "User not found",
      });
    }
     user.status = newStatus;
     await user.save();

     //CREATING A NOTIFICATION
      await Notification.create({
        recipient : user._id,
        message : `Your account has ${user.status==="active" ? "activated" : "disabled"}`,
        type : user.status==="active"? "account_enabled" : "account_disabled"
      })

    res.send({
      message: "User status updated successfully",
      user,
    });
  } catch (e) {
    res.status(500).send({
      message: e.message,
    });
  }
});

// Get all issues
router.get("/issues", auth, admin, async (req, res) => {
  try {
    const issues = await Issue.find().populate("creator", "name email");
    res.status(200).send({issues});
  } catch (e) {
    res.status(500).send(e);
  }
});

// Change the status of the issue

router.patch("/issues/:id/status", auth, admin, async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).send({
        message: "Invalid issue id",
      });
    }
    const { newStatus } = req.body;
    const allowedStatus = ["submitted", "in progress", "resolved"];
    if (!allowedStatus.includes(newStatus)) {
      return res.status(400).send({
        message: "Invalid status",
      });
    }
    const issue = await Issue.findById(req.params.id);
    if (!issue) {
      return res.status(404).send({
        message: "Issue not found",
      });
    }
    issue.status = newStatus;

    const oldStatus = issue.status;
    issue.status = newStatus;
   if (oldStatus !== "resolved" && newStatus === "resolved") {
  issue.resolvedAt = new Date();
  await Activity.create({
    type: "resolve",
    message: `${req.user.name} resolved the issue: ${issue.title}`,
    user: req.user._id,
    issue: issue._id,
  });
}

if (oldStatus === "resolved" && newStatus !== "resolved") {
  await Activity.create({
    type: "status",
    message: `${req.user.name} reopened the issue: ${issue.title}`,
    user: req.user._id,
    issue: issue._id,
  });
}
await issue.save();

if (issue.status === "resolved"){

  await Notification.create({
   recipient : issue.user,
   message : "Your issue is resolved",
   type : "issue_resolved",
   issue : issue._id
  })
  
}


res.send({issue});
  } catch (e) {
    res.status(500).send({
      message: e.message,
    });
  }
});

// DELETE issue

router.delete("/issues/:id", auth, admin, async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).send({
        message: "Invalid issue id",
      });
    }

    const issue = await Issue.findByIdAndDelete(req.params.id);

    if (!issue) {
      return res.status(404).send({
        message: "Issue not found",
      });
    }

    res.send({
      message: "Issue deleted successfully",
    });
  } catch (e) {
    res.status(500).send({
      message: e.message,
    });
  }
});

// GET the dashboard

router.get("/dashboard", auth, admin, async (req, res) => {
  try {
    const totalUsers = await User.countDocuments();
    const totalIssues = await Issue.countDocuments();
    const submitted = await Issue.countDocuments({
      status: "submitted",
    });
    const inProgress = await Issue.countDocuments({
      status: "in progress",
    });
    const resolved = await Issue.countDocuments({
      status: "resolved",
    });

    const pending = parseInt(inProgress) + parseInt(submitted);

    const activeUsers = await User.countDocuments({
      status : "active"
    });

   const startOfWeek = new Date()
   startOfWeek.setDate(startOfWeek.getDate() - 7)
   const issuesThisWeek = await Issue.countDocuments({
    createdAt: { $gte: startOfWeek }
   });
    const startLastWeek = new Date()
    startLastWeek.setDate(startLastWeek.getDate() - 14)
    const endLastWeek = new Date()
    endLastWeek.setDate(endLastWeek.getDate() - 7)
    const issuesLastWeek = await Issue.countDocuments({
        createdAt: {
            $gte: startLastWeek,
            $lt: endLastWeek
        }
    });


   const percentage =
   issuesLastWeek === 0
    ? (issuesThisWeek > 0 ? 100 : 0)
    : Math.round(
        ((issuesThisWeek - issuesLastWeek) / issuesLastWeek) * 100
      );


   // RESOLVATION RATE
    const resolvedIssues = await Issue.find({
    status: "resolved"
    })
    let total = 0
    resolvedIssues.forEach(issue => {
    total += issue.resolvedAt - issue.createdAt
    })
     
    let averageResolutionDays = 0
    if (resolvedIssues.length > 0) {
    let total = 0
    resolvedIssues.forEach(issue => {
    total += issue.resolvedAt - issue.createdAt
    })
    averageResolutionDays =
        (total / resolvedIssues.length) /
        (1000 * 60 * 60 * 24)
}
// RESPONSE RATE CALCULATION 
    const responseRate =
      totalIssues === 0
        ? 0
        : Math.round(((inProgress + resolved) / totalIssues) * 100);

    const targetResolutionDays = 2.5;


    res.send({
      totalUsers,
      totalIssues,
      activeUsers,
      submitted,
      inProgress,
      resolved,
      pending,
      issuesThisWeek,
      percentage,
      averageResolutionDays,
      responseRate,
      targetResolutionDays,
    });
  } catch (e) {
    res.status(500).send({
      message: e.message,
    });
  }
});

// RECENT ACTIVITIES

router.get("/recentActivities", auth, admin, async (req, res) => {
  try {

    const recentUsers = await User.find()
      .sort({ createdAt: -1 })
      .limit(5)
      .select("name createdAt");

    const recentIssues = await Issue.find()
      .sort({ createdAt: -1 })
      .limit(5)
      .select("title createdAt");

    const recentResolved = await Issue.find({
      status: "resolved"
    })
      .sort({ resolvedAt: -1 })
      .limit(5)
      .select("title resolvedAt");

    const recentComments = await Comment.find()
      .populate("user", "name")
      .populate("issue", "title")
      .sort({ createdAt: -1 })
      .limit(5);

    let activities = [];

    recentUsers.forEach(user => {
      activities.push({
        _id : user._id,
        type: "user",
        message: `New user registered: ${user.name}`,
        createdAt: user.createdAt
      });
    });

    recentIssues.forEach(issue => {
      
      activities.push({
        _id : issue._id,
        type: "issue",
        message: `New issue reported: ${issue.title}`,
        createdAt: issue.createdAt
      });
    });

    recentResolved.forEach(issue => {
     
      activities.push({
        _id : issue._id,
        type: "resolve",
        message: `Issue resolved: ${issue.title}`,
        resolvedAt : issue.resolvedAt
      });
    });

    recentComments.forEach(comment => {
      activities.push({
        _id : comment._id,
        type: "comment",
        message: `${comment.user.name} commented on "${comment.issue.title}"`,
        createdAt: comment.createdAt
      });
    });

    activities.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

    res.send({
      activities: activities.slice(0, 10)
    });

  } catch (e) {
    res.status(500).send({
      message: e.message
    });
  }
});

module.exports = router;
