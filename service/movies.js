const fetch = require('node-fetch');
const JSONAPISerializer = require('jsonapi-serializer').Serializer;
const Movie = require('../models/movie');

const movieSerializer = new JSONAPISerializer('movie', { attributes: ['Title', 'Year', 'Rated', 'Released',
  'Runtime', 'Genre', 'Director', 'Writer', 'Actors', 'Plot', 'Language', 'Country', 'Awards', 'Poster',
  'Metascore', 'imdbRating', 'Production'],
keyForAttribute: 'camelCase' });

const env = process.env.NODE_ENV || 'test';
const config = require('../config/config')[env];

async function fetchMovie(title) {
  const data = await fetch(`http://www.omdbapi.com/?apikey=${config.API_KEY}&t=${title}`);
  const movieJson = await data.json();
  return movieJson;
}

async function postMovie(movie) {
  if(!movie.title) {
    throw new Error('Title required');
  }
  const imbdData = await fetchMovie(movie.title);
  const serializedMovie = movieSerializer.serialize(imbdData);
  const preparedMovie = Object.assign(serializedMovie.data.attributes, movie);
  const newMovie = await Movie.create(preparedMovie);
  return newMovie.getPublicFields();
}

module.exports = {
  fetchMovie,
  postMovie,
};
