const mongoose = require("mongoose");


const commentSchema = new mongoose.Schema({
    message : String,
    issue : {
        type : mongoose.Schema.Types.ObjectId,
        required : true,
        ref : "Issue"
    },
    user : {
        type : mongoose.Schema.Types.ObjectId,
        required : true,
        ref : "User"
    }
},
{
    timestamps : true
}
)




const Comment = mongoose.model("Comment", commentSchema);
module.exports = comment;