const { expect } = require('chai');
const chai = require('chai');
const sinon = require('sinon');
const fetch = require('node-fetch');
const sinonChai = require('sinon-chai');
const chaiAsPromised = require('chai-as-promised');
const proxyquire = require('proxyquire');
const { spy } = require('sinon');
const fetchSpy = spy(require('node-fetch'));
const service = require('../../service');
const appPromise = require('../../app');
const Movie = require('../../models/movie');
const { createTestMovie } = require('../utils');

const { NotFoundError } = require('../../service/utils/error');

chai.use(chaiAsPromised);
chai.use(sinonChai);

const env = process.env.NODE_ENV || 'test';
const config = require('../../config/config')[env];

const jsonData = require('../data/movie');
const jsonNotFound = require('../data/notFound');
const expectedMovie = require('../data/expectedMovie');

describe('movies service', () => {
  before(async () => {
    await Movie.deleteMany({});
    await appPromise();
  });
  it('properly make url for api request', async () => {
    const moviesModule = proxyquire(
      '../../service/movies',
      { 'node-fetch': fetchSpy },
    );
    const title = 'The Matrix';
    moviesModule.fetchMovie(title);
    expect(fetchSpy.args[0]).to.deep.equal([`http://www.omdbapi.com/?apikey=${config.API_KEY}&t=${title}`]);
    sinon.restore();
  });
  it('prepares data for db and creates new movie', async () => {
    const responseObject = { status: '200', json: () => jsonData };
    sinon.stub(fetch, 'Promise').returns(Promise.resolve(responseObject));
    const movie = {
      title: 'The Matrix',
      year: '2017',
    };
    const data = await service.movies.postMovie(movie);
    expect(data.id).to.be.an('string');
    const { id } = data;
    delete data.id;
    expect(data).to.deep.equal(expectedMovie);
    const dataFromDb = (await Movie.findById(id)).getPublicFields();
    delete dataFromDb.id;
    expect(data).to.deep.equal(dataFromDb);
    sinon.restore();
  });
  it('throws error when tile missing', async () => {
    const responseObject = { status: '200', json: () => jsonData };
    sinon.stub(fetch, 'Promise').returns(Promise.resolve(responseObject));
    const movie = {
      title: '',
      year: '2019',
    };
    await expect(service.movies.postMovie(movie)).to.be.rejectedWith('Title required');
    sinon.restore();
  });
  it('throws error NotFoundError when movie not found in IMBDAPI', async () => {
    const responseObject = { status: '200', json: () => jsonNotFound };
    sinon.stub(fetch, 'Promise').returns(Promise.resolve(responseObject));
    const movie = {
      title: 'no movie',
      year: '2019',
    };
    await expect(service.movies.postMovie(movie)).to.be.rejectedWith(NotFoundError);
    sinon.restore();
  });
  it('returns all movies from db', async () => {
    const allMovies = await Movie.find({});
    const data = await service.movies.get();
    expect(data).to.haveOwnProperty('page');
    expect(data).to.haveOwnProperty('pageLimit');
    expect(data).to.haveOwnProperty('movies');
    expect(data).to.haveOwnProperty('moviesCount');
    expect(data.movies.length).to.equal(allMovies.length);
  });
  it('returns movies with comments', async () => {
    await Movie.deleteMany({});
    const newMovie = await createTestMovie({ title: 'X-man' });
    const comment = await service.comments.add({
      author: 'x-man',
      comment: 'wow',
    }, newMovie.id);
    const checkMovie = (await service.movies.get()).movies[0];
    expect(checkMovie.comments[0]).to.deep.equal(comment);
  });
});
