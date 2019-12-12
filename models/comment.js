const mongoose = require('mongoose');

const { Schema } = mongoose;

const commentSchema = new Schema({
  author: {
    type: String,
    required: true,
  },
  content: String,
});

module.exports = mongoose.model('Comment', commentSchema);
