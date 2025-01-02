const express = require('express');
const multer = require('multer');
const path = require('path');
const Course = require('../models/course');
const Student = require('../models/student');
const auth = require('../middleware/auth');

const router = express.Router();

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const isVideo = file.mimetype.startsWith('video');
    const uploadPath = isVideo ? 'uploads/videos' : 'uploads/images';
    cb(null, uploadPath);
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});

const upload = multer({
  storage: storage,
  fileFilter: (req, file, cb) => {
    const filetypes = /jpeg|jpg|png|mp4/;
    const mimetype = filetypes.test(file.mimetype);
    const extname = filetypes.test(path.extname(file.originalname).toLowerCase());

    if (mimetype && extname) {
      return cb(null, true);
    }
    cb(new Error('Error: File upload only supports the following filetypes - ' + filetypes));
  }
});

router.post('/', upload.single('video'), (req, res) => {
  const baseUrl = 'http://localhost:3000';
  const videoUrl = req.file ? `${baseUrl}/uploads/videos/${req.file.filename}` : '';

  const course = new Course({
    title: req.body.title,
    description: req.body.description,
    stage: req.body.stage,
    category: req.body.category,
    videoUrl: videoUrl,
  });

  course.save()
    .then(course => res.status(201).send(course))
    .catch(err => {
      console.error('Error saving course:', err);
      res.status(500).send('Error saving course');
    });
});

router.get('/', auth(), async (req, res) => {
  const { stage, category } = req.query;
  const userId = req.user._id;

  try {
    const user = await Student.findById(userId);
    const courses = await Course.find({
      stage: { $regex: new RegExp(stage, "i") },
      category: { $regex: new RegExp(category, "i") }
    });

    const userCoursesProgress = courses.map(course => {
      const progress = user.courseProgress.find(progress => progress.courseId.toString() === course._id.toString());
      return {
        ...course.toObject(),
        watchedVideos: progress ? progress.watchedVideos : []
      };
    });

    res.send(userCoursesProgress);
  } catch (err) {
    console.error('Error fetching courses:', err);
    res.status(500).send('Error fetching courses');
  }
});


router.get('/:stage/:category/:title', auth(), async (req, res) => {
  const { stage, category, title } = req.params;
  const userId = req.user._id;

  try {
    const user = await Student.findById(userId);
    const course = await Course.findOne({
      stage: { $regex: new RegExp(stage, "i") },
      category: { $regex: new RegExp(category, "i") },
      title: { $regex: new RegExp(title, "i") }
    });

    if (!course) {
      return res.status(404).send('Course not found');
    }

    const progress = user.courseProgress.find(progress => progress.courseId.toString() === course._id.toString());
    res.json({ ...course.toObject(), watchedVideos: progress ? progress.watchedVideos : [] });
  } catch (error) {
    res.status(500).send('Error fetching course details');
  }
});

router.patch('/:id/completion', auth(), async (req, res) => {
  const { id } = req.params; // course ID
  const { videoUrl } = req.body; // video URL

  try {
    const studentId = req.user._id;
    const student = await Student.findById(studentId);

    if (!student) {
      return res.status(404).send('Student not found');
    }

    const courseProgress = student.courseProgress.find(progress => progress.courseId.toString() === id);

    if (courseProgress) {
      if (!courseProgress.watchedVideos.includes(videoUrl)) {
        courseProgress.watchedVideos.push(videoUrl);
      }
    } else {
      student.courseProgress.push({
        courseId: id,
        watchedVideos: [videoUrl]
      });
    }

    await student.save();
    res.send(student);
  } catch (err) {
    console.error('Error updating course completion status:', err);
    res.status(500).send('Error updating course completion status');
  }
});

router.delete('/:id', (req, res) => {
  const { id } = req.params;
  Course.findByIdAndDelete(id)
    .then(course => {
      if (!course) {
        return res.status(404).send('Course not found');
      }
      res.send(course);
    })
    .catch(err => {
      console.error('Error deleting course:', err);
      res.status(500).send('Error deleting course');
    });
});

router.put('/:id', upload.single('video'), (req, res) => {
  const { id } = req.params;
  const baseUrl = 'http://localhost:3000';
  const videoUrl = req.file ? `${baseUrl}/uploads/videos/${req.file.filename}` : '';

  const updatedCourse = {
    title: req.body.title,
    description: req.body.description,
    stage: req.body.stage,
    category: req.body.category,
  };

  if (videoUrl) {
    updatedCourse.videoUrl = videoUrl;
  }

  Course.findByIdAndUpdate(id, updatedCourse, { new: true })
    .then(course => {
      if (!course) {
        return res.status(404).send('Course not found');
      }
      res.send(course);
    })
    .catch(err => {
      console.error('Error updating course:', err);
      res.status(500).send('Error updating course');
    });
});

module.exports = router;
