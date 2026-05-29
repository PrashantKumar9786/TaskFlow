const router = require("express").Router();
const auth = require("../middleware/auth");
const Task = require("../models/Task");

// All routes protected
router.use(auth);

// Get all tasks for logged-in user
router.get("/", async (req, res) => {
  try {
    const tasks = await Task.find({ user: req.userId }).sort({ createdAt: -1 });
    res.json(tasks);
  } catch {
    res.status(500).json({ message: "Server error" });
  }
});

// Create task
router.post("/", async (req, res) => {
  try {
    const { title, description, stage, priority } = req.body;
    if (!title) return res.status(400).json({ message: "Title is required" });
    const task = await Task.create({
      user: req.userId,
      title,
      description,
      stage,
      priority,
    });
    res.status(201).json(task);
  } catch {
    res.status(500).json({ message: "Server error" });
  }
});

// Update task (title, description, stage, priority)
router.put("/:id", async (req, res) => {
  try {
    const task = await Task.findOneAndUpdate(
      { _id: req.params.id, user: req.userId },
      req.body,
      { new: true, runValidators: true },
    );
    if (!task) return res.status(404).json({ message: "Task not found" });
    res.json(task);
  } catch {
    res.status(500).json({ message: "Server error" });
  }
});

// Delete task
router.delete("/:id", async (req, res) => {
  try {
    const task = await Task.findOneAndDelete({
      _id: req.params.id,
      user: req.userId,
    });
    if (!task) return res.status(404).json({ message: "Task not found" });
    res.json({ message: "Deleted" });
  } catch {
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
