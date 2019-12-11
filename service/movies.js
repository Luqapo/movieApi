const fetch = require('node-fetch');

const env = process.env.NODE_ENV || 'test';
const config = require('../config/config')[env];

async function fetchMovie(title) {
  console.log('Movie to fetch', title);
  const data = await fetch(`http://www.omdbapi.com/?apikey=${config.API_KEY}&t=${title}`);
  const movieJson = await data.json();
  console.log('MOVIE ->', movieJson);

  { Response: 'False', Error: 'Movie not found!' }
}

module.exports = {
  fetchMovie,
};
