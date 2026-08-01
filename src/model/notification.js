const { default: mongoose } = require("mongoose");

const notificationSchema = new mongoose.Schema(
{
    recipient: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    message: {
        type: String,
        required: true
    },
    type: {
        type: String,
        enum: [
        "new_issue",
        "new_user",
        "new_comment",
        
        "status_changed", //for users
        "account_disabled", //for users
        "account_enabled",  //for users
        "welcome" //for users
    ],
        required: true
    },
    issue: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Issue",
        default: null
    },
    comment: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Comment",
        default: null
    },
    isRead: {
        type: Boolean,
        default: false
    }
},
{
    timestamps: true
});


module.exports = mongoose.model("Notification", notificationSchema);