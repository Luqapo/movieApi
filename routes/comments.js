const Router = require('koa-router');
const service = require('../service');
const { handleError } = require('../service/utils/error');

const router = new Router({ prefix: '/comments' });

router.get('/', async (ctx, next) => {
  try {
    const comments = await service.movies.get();
    ctx.body = comments;
  } catch(err) {
    handleError(ctx, err);
  }
  next();
});

module.exports = router;
