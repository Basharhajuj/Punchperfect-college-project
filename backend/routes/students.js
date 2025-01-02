const express = require('express');
const multer = require('multer');
const path = require('path');
const Student = require('../models/student');
const auth = require('../middleware/auth');
const jwt = require('jsonwebtoken');

const router = express.Router();

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/profile-pictures');
  },
  filename: (req, file, cb) => {
    cb(null, `${req.user._id}${path.extname(file.originalname)}`);
  }
});

const upload = multer({ storage });

router.post('/register', async (req, res) => {
  const { firstname, lastname, email, password } = req.body;
  try {
    const newStudent = new Student({ firstname, lastname, email, password });
    await newStudent.save();
    res.status(201).json({ message: 'User registered successfully' });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await Student.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: 'User not found' });
    }

    if (user.password !== password) {
      return res.status(400).json({ message: 'Invalid password' });
    }

    const token = jwt.sign({ id: user._id, role: user.role }, 'your-secret-key', { expiresIn: '1h' });
    res.json({ token, role: user.role, id: user._id, skillLevel: user.skillLevel, profilePicture: user.profilePicture });
  } catch (error) {
    res.status(500).json({ message: 'Internal Server Error' });
  }
});

router.use(auth());

router.get('/profile', async (req, res) => {
  try {
    const userId = req.user._id;
    if (!userId) {
      return res.status(401).json({ message: 'Unauthorized: No user ID found' });
    }

    const user = await Student.findById(userId, 'firstname email skillLevel profilePicture');
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json(user);
  } catch (err) {
    console.error('Error fetching user profile:', err);
    res.status(500).json({ message: 'Error fetching user profile', error: err.message });
  }
});

router.post('/profile/change-password', async (req, res) => {
  try {
    const userId = req.user._id;
    const { oldPassword, newPassword } = req.body;

    const user = await Student.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    if (user.password !== oldPassword) {
      return res.status(400).json({ message: 'Incorrect old password' });
    }

    user.password = newPassword;
    await user.save();

    res.json({ message: 'Password changed successfully' });
  } catch (err) {
    console.error('Error changing password:', err);
    res.status(500).json({ message: 'Error changing password', error: err.message });
  }
});

router.post('/profile/picture', upload.single('profilePicture'), async (req, res) => {
  try {
    const userId = req.user._id;
    const user = await Student.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    user.profilePicture = `/uploads/profile-pictures/${req.file.filename}`;
    await user.save();

    res.json({ message: 'Profile picture uploaded successfully', profilePicture: user.profilePicture });
  } catch (err) {
    console.error('Error uploading profile picture:', err);
    res.status(500).json({ message: 'Error uploading profile picture', error: err.message });
  }
});

module.exports = router;
