const mongoose = require("mongoose");
const { type } = require("node:os");
const { ref } = require("node:process");
const validator = require("validator");


const issueSchema = new mongoose.Schema({
    title : {
        type : String,
        required : true,
        trim : true
    },
    category : {
        type : String,
        required : true,
    },
    description : {
        type : String,
        required : true,
        trim : true,
    },
    severity : {
        type : String,
    },
    affected : {
        type : Number,
        required : true,
        validate(value){
            if(value<1){
                throw new Error ("Please enter the appropriate number of affected peoples");
            }
        }
    },
    location : {
        type : String,
        required : true,
        trim : true,
    },
    file :{
        type : Buffer,
    },
    duration : {
        type : Number,
        },
    importanceAre :{
        type : String,
        trim : true
    },
    creator : {
        type : mongoose.Schema.Types.ObjectId,
        ref : "Issue",
        required : true
    }




} )





const Issue = mongoose.model("Issue",issueSchema);

module.exports = Issue;