const express = require("express");
const router = new express.Router();
const User = require("../model/users");
const Issue = require("../model/issue");
const auth = require("../middleware/auth");
const admin = require("../middleware/admin");
const mongoose = require("mongoose");

// Get all users
router.get("/users", auth, admin, async (req, res) => {
  try {
    const users = await User.find().select("-password");
    res.status(200).send(users);
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

    const { role } = req.body;

    if (!["user", "admin"].includes(role)) {
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

    user.role = role;

    await user.save();

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

// DELETE users

router.delete("/users/:id", auth, admin, async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).send({
        message: "Invalid user id",
      });
    }

    const user = await User.findByIdAndDelete(req.params.id);

    if (!user) {
      return res.status(404).send({
        message: "User not found",
      });
    }

    res.send({
      message: "User deleted successfully",
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
    res.status(200).send(issues);
  } catch (e) {
    res.status(500).send(e);
  }
});

// Change the atatus of the issue

router.patch("/issues/:id/status", auth, admin, async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).send({
        message: "Invalid issue id",
      });
    }

    const { status } = req.body;

    const allowedStatus = ["submitted", "in progress", "resolved"];

    if (!allowedStatus.includes(status)) {
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

    issue.status = status;

    await issue.save();

    res.send(issue);
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

    res.send({
      totalUsers,
      totalIssues,
      submitted,
      inProgress,
      resolved,
    });
  } catch (e) {
    res.status(500).send({
      message: e.message,
    });
  }
});

module.exports = router;
