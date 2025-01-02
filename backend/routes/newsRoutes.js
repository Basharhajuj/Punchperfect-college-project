const express = require('express');
const router = express.Router();
const News = require('../models/news');

// Get news
router.get('/', async (req, res) => {
  try {
    const news = await News.findOne();
    res.json(news);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Update news
router.put('/', async (req, res) => {
  try {
    const updatedNews = await News.findOneAndUpdate({}, req.body, { new: true });
    res.json(updatedNews);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});



module.exports = router;
