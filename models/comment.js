const mongoose = require('mongoose');

const { Schema } = mongoose;

const commentSchema = new Schema({
  author: {
    type: String,
    required: true,
  },
  comment: {
    type: String,
    required: true,
  },
  movie: {
    type: Schema.Types.ObjectId,
    ref: 'Movie',
  },
});

commentSchema.methods.getPublicFields = function getPublicFields() {
  return {
    id: this._id.toString(),
    author: this.author,
    comment: this.comment,
  };
};

module.exports = mongoose.model('Comment', commentSchema);
