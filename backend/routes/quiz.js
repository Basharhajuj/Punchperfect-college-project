const express = require('express');
const Student = require('../models/student');

const router = express.Router();

router.post('/', async (req, res) => { // Note the single forward slash here
  const { email, score } = req.body;
  console.log('Received quiz submission:', { email, score }); // Log the received data

  let skillLevel = 'Beginner';

  if (score >= 8) {
    skillLevel = 'Professional';
  } else if (score >= 5) {
    skillLevel = 'Intermediate';
  }

  console.log('Determined skill level:', skillLevel); // Log the determined skill level

  try {
    const student = await Student.findOneAndUpdate(
      { email },
      { skillLevel },
      { new: true }
    );
    if (!student) {
      return res.status(404).json({ message: 'User not found' });
    }
    console.log('Updated student:', student); // Log the updated student
    res.status(200).json({ message: 'Skill level updated', skillLevel: student.skillLevel });
  } catch (error) {
    console.error('Error updating skill level:', error); // Log any errors
    res.status(400).json({ message: error.message });
  }
});

module.exports = router;
