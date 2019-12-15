const request = require('supertest');
const { expect } = require('chai');
const sinon = require('sinon');

const appInit = require('../../app');
const Movie = require('../../models/movie');
const Comment = require('../../models/comment');
const { createTestMovie } = require('../utils');


let app;

describe('comments routes', () => {
  before(async () => {
    app = await appInit();
    await Movie.deleteMany({});
    await Comment.deleteMany({});
  });
  after(() => sinon.restore());
  describe('POST /comments', () => {
    it('creates new comment', async () => {
      const commentData = {
        author: 'post Test',
        comment: '10',
      };
      const movieTitle = 'The Thing';
      const movie = await createTestMovie({ title: movieTitle });
      let comment;
      await request(app.callback())
        .post(`/comments/${movie.id}`)
        .send(commentData)
        .expect(201)
        .then((res) => {
          comment = res.body;
          expect(comment).to.haveOwnProperty('id');
          expect(comment).to.haveOwnProperty('author');
          expect(comment.author).to.equal(commentData.author);
          expect(comment).to.haveOwnProperty('comment');
          expect(comment.comment).to.equal(commentData.comment);
        });
      const checkMovie = (await Movie.findOne({ title: movieTitle })
        .populate('comments'))
        .getPublicFields();
      expect(checkMovie.comments[0]).to.deep.equal(comment);
    });
    it('returns 422 when author is missing', async () => {
      const commentData = {
        author: '',
        comment: '101',
      };
      const movieTitle = 'Avatar';
      const movie = await createTestMovie({ title: movieTitle });
      await request(app.callback())
        .post(`/comments/${movie.id}`)
        .send(commentData)
        .expect(422)
        .then((res) => {
          expect(res.body).to.haveOwnProperty('error');
          expect(res.body.error).to.equal('Path `author` is required.');
        });
    });
    it('returns 422 when comment text is missing', async () => {
      const commentData = {
        author: 'no comment',
        comment: '',
      };
      const movieTitle = 'Avatar II';
      const movie = await createTestMovie({ title: movieTitle });
      await request(app.callback())
        .post(`/comments/${movie.id}`)
        .send(commentData)
        .expect(422)
        .then((res) => {
          expect(res.body).to.haveOwnProperty('error');
          expect(res.body.error).to.equal('Path `comment` is required.');
        });
    });
  });
  describe('GET /comments', () => {
    it('returns all comments', async () => {
      const commentData = {
        author: 'no comment',
        comment: 'omg',
      };
      const movieTitle = 'Pitch Black';
      const movie = await createTestMovie({ title: movieTitle });
      await request(app.callback())
        .post(`/comments/${movie.id}`)
        .send(commentData)
        .expect(201);
      const allComments = await Comment.find({});
      await request(app.callback())
        .get('/comments')
        .expect(200)
        .then((res) => {
          const comments = res.body;
          expect(comments).to.be.an('array');
          expect(comments.length).to.equal(allComments.length);
          comments.forEach((c, i) => {
            expect(c).to.deep.equal(allComments[i].getPublicFields());
          });
        });
    });
  });
});
