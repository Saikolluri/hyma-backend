const mongoose = require("mongoose");

const commentSchema = new mongoose.Schema({
  text: String,
  createdAt: {
    type: Date,
    default: Date.now
  }
});

const ideaSchema = new mongoose.Schema({
  title: String,
  description: String,
  comments: [commentSchema],
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model("Idea", ideaSchema);

