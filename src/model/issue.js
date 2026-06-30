const mongoose = require("mongoose");
const { type } = require("node:os");
const { ref } = require("node:process");
const validator = require("validator");

const issueSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true,
  },
  category: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
    trim: true,
  },
  severity: {
    type: String,
    enum: ["low", "medium", "high", "critical"],
    default: "medium",
  },
  affectedPeople: {
    type: Number,
    required: true,
    validate(value) {
      if (value < 1) {
        throw new Error(
          "Please enter the appropriate number of affected peoples",
        );
      }
    },
    default: 1,
  },
   priorityScore: {
    type: Number,
    required: true,
    default: 5,
  },
  location: {
    type: String,
    required: true,
    trim: true,
  },
  file: {
    type: Buffer,
  },
  durationHours: {
    type: Number,
  },
  importanceAre: {
    type: String,
    trim: true,
  },
  creator: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  
},
{
    timestamps : true
});

const Issue = mongoose.model("Issue", issueSchema);

module.exports = Issue;
