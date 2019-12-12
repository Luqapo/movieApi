const request = require('supertest');
const { expect } = require('chai');
const sinon = require('sinon');
const fetch = require('node-fetch');

const appInit = require('../../app');
const Movie = require('../../models/movie');

const jsonData = require('../data/movie.json');
const expectedMovie = require('../data/expectedMovie');

let app;

describe('POST /movies', () => {
  before(async () => {
    const responseObject = { status: '200', json: () => jsonData };
    sinon.stub(fetch, 'Promise').returns(Promise.resolve(responseObject));
    app = await appInit();
    await Movie.deleteMany({});
  });
  after(() => sinon.restore());
  it('creates new movie', async () => {
    const movieData = {
      title: 'The Matrix',
      year: '2017',
    };
    await request(app.callback())
      .post('/movies')
      .send(movieData)
      .expect(201)
      .then((res) => {
        delete res.body.id;
        expect(res.body).to.deep.equal(expectedMovie);
      });
  });
});
