const sinon = require('sinon');
const fetch = require('node-fetch');
const service = require('../service');
const jsonData = require('./data/movie.json');

async function createTestMovie(movie) {
  const responseObject = { status: '200', json: () => jsonData };
  sinon.stub(fetch, 'Promise').returns(Promise.resolve(responseObject));
  const testMovie = await service.movies.postMovie(movie);
  sinon.restore();
  return testMovie;
}

module.exports = {
  createTestMovie,
};
