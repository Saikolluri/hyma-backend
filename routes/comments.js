const express = require("express");
const router = express.Router();
const Comment = require("../models/Comment");

// POST a comment
router.post("/", async (req, res) => {
  try {
    const comment = new Comment(req.body);
    await comment.save();
    res.status(201).json(comment);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET comments for an idea
router.get("/:ideaId", async (req, res) => {
  try {
    const comments = await Comment.find({ ideaId: req.params.ideaId });
    res.json(comments);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;

