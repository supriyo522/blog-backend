const mongoose = require('mongoose');

const BlogSchema = new mongoose.Schema({
  title: { type: String, required: true },
  content: { type: String, required: true },
  author: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  location: { type: String, required: true },
  media: [{ type: String }], 
  date: { type: Date, default: Date.now },
  isPublished: { type: Boolean, default: false }
});

module.exports = mongoose.model('Blog', BlogSchema);
