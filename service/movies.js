const fetch = require('node-fetch');
const JSONAPISerializer = require('jsonapi-serializer').Serializer;
const Movie = require('../models/movie');
const { RequestError, ConflictError, NotFoundError } = require('./utils/error');

const movieSerializer = new JSONAPISerializer('movie', { attributes: ['Title', 'Year', 'Rated', 'Released',
  'Runtime', 'Genre', 'Director', 'Writer', 'Actors', 'Plot', 'Language', 'Country', 'Awards', 'Poster',
  'Metascore', 'imdbRating', 'Production'],
keyForAttribute: 'camelCase' });
/* istanbul ignore next */
const env = process.env.NODE_ENV || 'test';
const config = require('../config/config')[env];

async function fetchMovie(title) {
  const data = await fetch(`http://www.omdbapi.com/?apikey=${config.API_KEY}&t=${title}`);
  const movieJson = await data.json();
  return movieJson;
}

async function postMovie(movie) {
  if(!movie.title) {
    throw new RequestError('Title required');
  }
  const movieInDb = await Movie.findOne({ title: movie.title });
  if(movieInDb) {
    throw new ConflictError('Movie alredy in database');
  }
  const imbdData = await fetchMovie(movie.title);
  if(imbdData.Response === 'False') {
    throw new NotFoundError(imbdData.Error);
  }
  const serializedMovie = movieSerializer.serialize(imbdData);
  const preparedMovie = Object.assign(serializedMovie.data.attributes, movie);
  const newMovie = await Movie.create(preparedMovie);
  return newMovie.getPublicFields();
}

async function get(p, limit) {
  const page = p || 1;
  const pageLimit = limit || 10;
  const moviesCount = await Movie.countDocuments({});
  const movies = await Movie.find({})
    .skip((pageLimit * page) - pageLimit)
    .limit(pageLimit)
    .populate('comments');
  return {
    movies: movies.map((m) => m.getPublicFields()),
    page,
    moviesCount,
    pageLimit,
  };
}

module.exports = {
  fetchMovie,
  postMovie,
  get,
};
