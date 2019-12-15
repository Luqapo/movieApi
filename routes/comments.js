const Router = require('koa-router');
const service = require('../service');
const { handleError } = require('../service/utils/error');

const router = new Router({ prefix: '/comments' });

router.get('/', async (ctx, next) => {
  try {
    const comments = await service.comments.get();
    ctx.body = comments;
  } catch(err) {
    handleError(ctx, err);
  }
  next();
});

router.post('/:movieId', async (ctx, next) => {
  const { movieId } = ctx.params;
  try {
    const comments = await service.comments.add(ctx.request.body, movieId);
    ctx.status = 201;
    ctx.body = comments;
  } catch(err) {
    handleError(ctx, err);
  }
  next();
});

module.exports = router;
