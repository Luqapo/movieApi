const { expect } = require('chai');
const chai = require('chai');
const sinon = require('sinon');
const fetch = require('node-fetch');
const sinonChai = require('sinon-chai');
const chaiAsPromised = require('chai-as-promised');
const service = require('../../service');
const appPromise = require('../../app');
const Movie = require('../../models/movie');

chai.use(chaiAsPromised);
chai.use(sinonChai);

const jsonData = require('../data/movie.json');
const expectedMovie = require('../data/expectedMovie');

describe('movies service', () => {
  before(async () => {
    await Movie.deleteMany({});
    await appPromise();
  });
  it('fetch movie data from imbd', async () => {
    const title = 'The Matrix';
    const responseObject = { status: '200', json: () => jsonData };
    const fetchSpy = sinon.stub(fetch, 'Promise').returns(Promise.resolve(responseObject));
    const movie = await service.movies.fetchMovie(title);
    expect(fetchSpy).to.have.been.called;
    expect(movie).to.deep.equal(jsonData);
    sinon.restore();
  });
  it('prepares data for db', async () => {
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
  it('throws error if tile missing', async () => {
    const responseObject = { status: '200', json: () => jsonData };
    sinon.stub(fetch, 'Promise').returns(Promise.resolve(responseObject));
    const movie = {
      title: '',
      year: '2019',
    };
    await expect(service.movies.postMovie(movie)).to.be.rejectedWith(Error);
    sinon.restore();
  });
});
