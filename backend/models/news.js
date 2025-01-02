const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const NewsSchema = new Schema({
  header: {
    title: { type: String, required: true },
    description: { type: String, required: true },
    imageUrl: { type: String, required: true }
  },
  articles: [
    {
      imageUrl: String,
      title: String,
      description: String,
      cardLink: String
    }
  ]
});

module.exports = mongoose.model('News', NewsSchema);
