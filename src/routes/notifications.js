const express = require("express");
const Notification = require("../model/notfication");
const auth = require("../middleware/auth");
const router = express.Router();

//Access the notification

router.get("/notifications", auth, async (req, res) => {
  try {
    const notifications = await Notification.find({
      user: req.user._id,
    }).sort({ createdAt: -1 });

    res.send(notifications);
  } catch (e) {
    res.status(500).send();
  }
});

// Read all notifications
router.patch("/notifications", auth, async (req, res) => {
  try {
    await Notification.updateMany(
      { user: req.user._id, read: false },
      { read: true }
    );

    res.send({ message: "All notifications marked as read" });
  } catch (e) {
    res.status(500).send();
  }
});






module.exports = router;