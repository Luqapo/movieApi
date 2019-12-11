const Router = require('koa-router');
const service = require('../service');
const { handleError } = require('../service/utils/error');

const router = new Router({ prefix: '/movie' });

router.get('/', async (ctx, next) => {
  try {
    const movies = await service.movies.get();
    ctx.body = movies;
  } catch(err) {
    handleError(ctx, err);
  }
  next();
});

module.exports = router;
