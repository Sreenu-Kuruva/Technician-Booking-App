import express from 'express';
import User from '../models/User';

const router = express.Router();

router.post('/register', async (req, res) => {
  try {
    const { username, email, password, role, category } = req.body;
    const user = new User({ username, email, password, role, category });
    await user.save();
    res.status(201).json(user);
  } catch (err) {
    res.status(500).json({ error: 'Registration failed' });
  }
});

router.post('/login', async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });
  if (!user || user.password !== password) return res.status(401).json({ error: 'Invalid credentials' });
  res.json(user);
});

export default router;