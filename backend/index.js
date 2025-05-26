require('dotenv').config();
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

const Note = require('./models/note.model');
const User = require('./models/user.model');
const { authenticateToken } = require('./utilities');
const config = require('./config.json');

const app = express();
const PORT = process.env.PORT || 8000;

app.use(cors({ origin: 'http://localhost:5173', credentials: true }));
app.use(express.json());

mongoose.connect(config.connectionString, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
  .then(() => console.log('✅ Connected to MongoDB'))
  .catch((err) => console.error('❌ MongoDB error:', err));

app.get('/', (req, res) => {
  res.json({ data: 'Hello World!' });
});

// --- Routes: Register, Login, Auth-protected Note Endpoints ---
app.post("/create-account", async (req, res) => {
  const { fullName, email, password } = req.body;

  if (!fullName || !email || !password)
    return res.status(400).json({ error: 'All fields are required' });

  const existingUser = await User.findOne({ email });
  if (existingUser)
    return res.status(409).json({ error: 'User already exists' });

  const hashedPassword = await bcrypt.hash(password, 10);

  const user = new User({ fullName, email, password: hashedPassword });
  await user.save();

  const token = jwt.sign({ userId: user._id }, process.env.ACCESS_TOKEN_SECRET, {
    expiresIn: '30600m'
  });

  res.status(201).json({
    error: false,
    message: 'User registered successfully',
    user: { id: user._id, fullName: user.fullName, email: user.email },
    accessToken: token,
  });
});

app.post("/login", async (req, res) => {
  const { email, password } = req.body;

  const userInfo = await User.findOne({ email });
  if (!userInfo || !(await bcrypt.compare(password, userInfo.password)))
    return res.status(401).json({ error: 'Invalid email or password' });

  const accessToken = jwt.sign({ userId: userInfo._id }, process.env.ACCESS_TOKEN_SECRET, {
    expiresIn: '30600m'
  });

  res.json({
    error: false,
    message: 'Login successful',
    user: { id: userInfo._id, fullName: userInfo.fullName, email: userInfo.email },
    accessToken,
  });
});

app.post("/get-user", authenticateToken, async (req, res) => {
  const user = await User.findById(req.user.userId).select("-password");
  if (!user)
    return res.status(404).json({ error: 'User not found' });

  res.json({ error: false, user });
});

// --- Notes CRUD ---
app.post("/add-note", authenticateToken, async (req, res) => {
  const { title, content, tags } = req.body;
  const note = new Note({ title, content, tags: tags || [], userId: req.user.userId });
  await note.save();
  res.json({ error: false, note });
});

app.put("/edit-note/:noteId", authenticateToken, async (req, res) => {
  const note = await Note.findOneAndUpdate(
    { _id: req.params.noteId, userId: req.user.userId },
    req.body,
    { new: true }
  );
  if (!note) return res.status(404).json({ error: 'Note not found' });
  res.json({ error: false, note });
});

app.delete("/delete-note/:noteId", authenticateToken, async (req, res) => {
  const note = await Note.findOneAndDelete({ _id: req.params.noteId, userId: req.user.userId });
  if (!note) return res.status(404).json({ error: 'Note not found' });
  res.json({ error: false, message: 'Note deleted' });
});

app.get("/get-all-notes", authenticateToken, async (req, res) => {
  const notes = await Note.find({ userId: req.user.userId }).sort({ isPinned: -1 });
  res.json({ error: false, notes });
});

app.put("/update-note-pinned/:noteId", authenticateToken, async (req, res) => {
  const note = await Note.findOneAndUpdate(
    { _id: req.params.noteId, userId: req.user.userId },
    { isPinned: req.body.isPinned },
    { new: true }
  );
  if (!note) return res.status(404).json({ error: 'Note not found' });
  res.json({ error: false, note });
});

app.listen(PORT, () => {
  console.log(`🚀 Backend server running at http://localhost:${PORT}`);
});


module.exports = app;
