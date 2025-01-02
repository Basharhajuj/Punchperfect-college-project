const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const path = require('path');
const cors = require('cors');
const session = require('express-session');
const MongoStore = require('connect-mongo');

const app = express();

app.use(cors());
app.use(bodyParser.json());
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

mongoose.connect('mongodb://localhost/PunchPerfect', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}).then(() => {
  console.log('Connected to MongoDB');
}).catch(err => {
  console.error('Error connecting to MongoDB', err);
  process.exit(1);
});

app.use(session({
  secret: 'your-secret-key',
  resave: false,
  saveUninitialized: true,
  store: MongoStore.create({ mongoUrl: 'mongodb://localhost/PunchPerfect' }),
  cookie: { secure: false }
}));

// Make sure these paths are correct
app.use('/api/courses', require('./routes/courses'));
app.use('/api/products', require('./routes/products'));
app.use('/api/news', require('./routes/newsRoutes'));
app.use('/api/cart', require('./routes/cartRoutes'));
app.use('/api/students', require('./routes/students'));
app.use('/api/quiz', require('./routes/quiz')); // Ensure this line is correct

app.listen(3000, () => {
  console.log('Server is running on port 3000');
});
