console.log("🔥 LOADED IDEAS ROUTE FROM:", __filename);
const express = require("express");
const router = express.Router();
const Idea = require("../models/Idea");
const Subscriber = require("../models/Subscriber");

/* =========================
   EMAIL SUBSCRIBE (FIRST)
   ========================= */
router.post("/subscribe", async (req, res) => {
  const { email } = req.body;

  if (!email) {
    return res.status(400).json({ message: "Email required" });
  }

  try {
    const exists = await Subscriber.findOne({ email });
    if (exists) {
      return res.status(409).json({ message: "Email already subscribed" });
    }

    const sub = new Subscriber({ email });
    await sub.save();

    res.json({ message: "Subscribed successfully" });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

/* =========================
   GET ALL IDEAS
   ========================= */
router.get("/", async (req, res) => {
  const ideas = await Idea.find().sort({ createdAt: -1 });
  res.json(ideas);
});

/* =========================
   POST NEW IDEA
   ========================= */
router.post("/", async (req, res) => {
  const { title, description } = req.body;

  if (!title || !description) {
    return res.status(400).json({ message: "Title and description required" });
  }

  const idea = new Idea({
    title,
    description,
    comments: []
  });

  await idea.save();
  res.json(idea);
});

/* =========================
   ADD COMMENT
   ========================= */
router.post("/:id/comments", async (req, res) => {
  const { text } = req.body;
  if (!text) {
    return res.status(400).json({ message: "Comment required" });
  }

  const idea = await Idea.findById(req.params.id);
  idea.comments.push({ text });
  await idea.save();

  res.json(idea);
});

/* =========================
   DELETE IDEA (ADMIN ONLY)
   ========================= */
router.delete("/:id", async (req, res) => {
  const adminKey = req.headers["x-admin-key"];

  if (adminKey !== process.env.ADMIN_KEY) {
    return res.status(403).json({ message: "Unauthorized" });
  }

  await Idea.findByIdAndDelete(req.params.id);
  res.json({ message: "Idea deleted" });
});

module.exports = router;

