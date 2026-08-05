const express = require("express");
const Notification = require("../model/notification");
const auth = require("../middleware/auth");
const notification = require("../model/notification");
const router = express.Router();

//Access the notification

router.get("/", auth, async (req, res) => {
  try {
    const notifications = await Notification.find({
      recipient: req.user._id,
    }).sort({ createdAt: -1 });

    res.send(notifications);
  } catch (e) {
    res.status(500).send();
  }
});

// Read all notifications
router.patch("/readAll", auth, async (req, res) => {
  try {
    await Notification.updateMany(
      { 
        recipient: req.user._id, 
        isRead: false 
      },
      { isRead: true },
    );

    res.send({ message: "All notifications marked as read" });
  } catch (e) {
    res.status(500).send();
  }
});

//READ A SINGLE NOTIFIFCATION
router.patch("/:id/read",auth, async(req, res)=> {
      try {
        const notification = await Notification.findOneAndUpdate({
          recipient : req.user._id,
          _id : req.params.id,
          isRead : false
        },
      {
        isRead : true
      })
        if(!notification){
          return res.status(404).send("Notification not found");
        }
        res.status(200).send({notification : notification,
          message : "Marked as read"
        });
      } catch (e) {
         res.status(500).send({message : e.message});
      }
})

module.exports = router;
