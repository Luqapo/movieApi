const Comment = require('../models/comment');
const Movie = require('../models/movie');

async function add(comment, movieId) {
  const newComment = await Comment.create(comment);
  const movie = await Movie.findById(movieId);
  if(movie) {
    movie.comments.push(newComment);
    await movie.save();
  }
  return newComment.getPublicFields();
}

async function get() {
  const comments = await Comment.find({});
  return comments.map((c) => c.getPublicFields());
}

module.exports = {
  add,
  get,
};
