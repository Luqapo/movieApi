const request = require('supertest');
const { expect } = require('chai');
const sinon = require('sinon');
const fetch = require('node-fetch');

const appInit = require('../../app');
const Movie = require('../../models/movie');

const jsonData = require('../data/movie.json');
const expectedMovie = require('../data/expectedMovie');

let app;

describe('movies routes', () => {
  before(async () => {
    const responseObject = { status: '200', json: () => jsonData };
    sinon.stub(fetch, 'Promise').returns(Promise.resolve(responseObject));
    app = await appInit();
    await Movie.deleteMany({});
  });
  after(() => sinon.restore());
  describe('POST /movies', () => {
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
    it('returns 400 when title missing', async () => {
      const movieData = {
        title: '',
        year: '2017',
      };
      await request(app.callback())
        .post('/movies')
        .send(movieData)
        .expect(400)
        .then((res) => {
          expect(res.body.error).to.deep.equal('Title required');
        });
    });
    it('returns 409 when movie alredy in database', async () => {
      const movieData = {
        title: 'The Matrix',
        year: '2018',
      };
      await request(app.callback())
        .post('/movies')
        .send(movieData)
        .expect(409)
        .then((res) => {
          expect(res.body.error).to.deep.equal('Movie alredy in database');
        });
    });
  });
  describe('GET /movies', () => {
    it('returns movies', async () => {
      await request(app.callback())
        .get('/movies')
        .expect(200)
        .then((res) => {
          const data = res.body;
          expect(data).to.haveOwnProperty('page');
          expect(data).to.haveOwnProperty('moviesCount');
          expect(data).to.haveOwnProperty('pageLimit');
          expect(data.pageLimit).to.equal(10);
          expect(data).to.haveOwnProperty('movies');
          expect(data.movies).to.be.an('array');
          expect(data.movies.length).to.equal(1);
          delete data.movies[0].id;
          expect(data.movies[0]).to.deep.equal(expectedMovie);
        });
    });
    it('returns movies and sets page limit from query string', async () => {
      const limit = 66;
      await request(app.callback())
        .get(`/movies/?limit=${limit}`)
        .expect(200)
        .then((res) => {
          const data = res.body;
          expect(data).to.haveOwnProperty('page');
          expect(data).to.haveOwnProperty('moviesCount');
          expect(data).to.haveOwnProperty('pageLimit');
          expect(data.pageLimit).to.equal(limit);
          expect(data).to.haveOwnProperty('movies');
          expect(data.movies).to.be.an('array');
          expect(data.movies.length).to.equal(1);
          delete data.movies[0].id;
          expect(data.movies[0]).to.deep.equal(expectedMovie);
        });
    });
  });
});
