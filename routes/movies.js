const Router = require('koa-router');
const service = require('../service');
const { handleError } = require('../service/utils/error');

const router = new Router({ prefix: '/movies' });

router.get('/', async (ctx, next) => {
  const { page, limit } = ctx.query;
  try {
    const movies = await service.movies.get(Number(page), Number(limit));
    ctx.body = movies;
  } catch(err) {
    handleError(ctx, err);
  }
  next();
});

router.post('/', async (ctx, next) => {
  try {
    const movie = await service.movies.postMovie(ctx.request.body);
    ctx.status = 201;
    ctx.body = movie;
  } catch(err) {
    handleError(ctx, err);
  }
  next();
});

module.exports = router;
