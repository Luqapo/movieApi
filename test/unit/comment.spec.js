const { expect } = require('chai');
const chai = require('chai');
const sinonChai = require('sinon-chai');
const chaiAsPromised = require('chai-as-promised');
const appPromise = require('../../app');
const service = require('../../service');
const Comment = require('../../models/comment');
const Movie = require('../../models/movie');

const { createTestMovie } = require('../utils');

chai.use(chaiAsPromised);
chai.use(sinonChai);

describe('comments service', () => {
  before(async () => {
    await appPromise();
    await Comment.deleteMany({});
    await Movie.deleteMany({});
  });
  it('creates new comment', async () => {
    const testComment = {
      author: 'The One',
      comment: 'first comment',
    };
    const newComment = await service.comments.add(testComment);
    expect(newComment).to.haveOwnProperty('id');
    expect(newComment.id).to.be.an('string');
    expect(newComment).to.haveOwnProperty('author');
    expect(newComment.author).to.be.an('string');
    expect(newComment).to.haveOwnProperty('comment');
    expect(newComment.comment).to.be.an('string');
    expect(Object.keys(newComment).length).to.equal(3);
  });
  it('throws error when author is missing', async () => {
    const testComment = {
      author: '',
      comment: 'second comment',
    };
    await expect(service.comments.add(testComment)).to.be.rejectedWith(Error);
  });
  it('throws error when comment is missing', async () => {
    const testComment = {
      author: 'uknown',
      comment: '',
    };
    await expect(service.comments.add(testComment)).to.be.rejectedWith(Error);
  });
  it('creates new comment for given movie', async () => {
    const movie = await createTestMovie({ title: 'The Matrix' });
    const comment = {
      author: 'Matrix fan',
      comment: 'great',
    };
    const newComment = await service.comments.add(comment, movie.id);
    const checkMovie = await Movie.findById(movie.id);
    expect(checkMovie.comments[0]._id.toString()).to.equal(newComment.id);
  });
});
