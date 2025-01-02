const mongoose = require('mongoose');

const studentSchema = new mongoose.Schema({
  firstname: { type: String, required: true },
  lastname: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  skillLevel: { type: String, enum: ['Beginner', 'Intermediate', 'Professional'], default: 'Beginner' },
  role: { type: String, enum: ['student', 'admin'], default: 'student' },
  courseProgress: [
    {
      courseId: { type: mongoose.Schema.Types.ObjectId, ref: 'Course' },
      watchedVideos: [String]
    }
  ],
  profilePicture: { type: String } // New field for profile picture
});

module.exports = mongoose.model('Student', studentSchema);
