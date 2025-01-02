const mongoose = require('mongoose');

const courseSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  stage: { type: String, required: true },
  category: { type: String, required: true },
  videoUrl: { type: String },
  watchedVideos: { type: [String], default: [] },
});

module.exports = mongoose.models.Course || mongoose.model('Course', courseSchema);
