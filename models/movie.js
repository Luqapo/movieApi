const mongoose = require('mongoose');

const { Schema } = mongoose;

const movieSchema = new Schema({
  title: {
    type: String,
    required: true,
  },
  year: String,
  rated: String,
  released: String,
  runtime: String,
  genre: String,
  director: String,
  writer: String,
  actors: String,
  plot: String,
  language: String,
  country: String,
  awards: String,
  poster: String,
  metascore: String,
  imdbRating: String,
  production: String,
  comments: [{
    type: Schema.Types.ObjectId,
    ref: 'Comment',
  }],
});

movieSchema.methods.getPublicFields = function getPublicFields() {
  return {
    id: this._id.toString(),
    title: this.title,
    year: this.year,
    rated: this.rated,
    released: this.released,
    runtime: this.runtime,
    genre: this.genre,
    director: this.director,
    writer: this.writer,
    actors: this.actors,
    plot: this.plot,
    language: this.language,
    country: this.country,
    awards: this.awards,
    poster: this.poster,
    metascore: this.metascore,
    imdbRating: this.imdbRating,
    production: this.production,
    comments: this.comments.map((c) => c.getPublicFields()),
  };
};

module.exports = mongoose.model('Movie', movieSchema);
