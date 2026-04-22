const mongoose = require("mongoose");


const notficationSchema = new mongoose.Schema({
    message : String,
    isRead : Boolean,
     user : {
           type : mongoose.Schema.Types.ObjectId,
           required : true,
           ref : "User"
       },
    issue : {
        type : mongoose.Schema.Types.ObjectId,
        required : true,
        ref : "Issue"
    }
},
{
    timeStamps : true

}
)