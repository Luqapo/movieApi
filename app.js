const Koa = require('koa');
const bodyParser = require('koa-bodyparser');
const cors = require('@koa/cors');
const dbInit = require('./db/db');
const router = require('./routes');

/* istanbul ignore next */
const env = process.env.NODE_ENV || 'test';
const config = require('./config/config')[env];

const PORT = process.env.PORT || config.PORT;
let appPromise;

const app = new Koa();

app.use(cors());

app.use(bodyParser({
  enableTypes: ['json'],
}));

app.use(async (ctx, next) => {
  try {
    await next();
  } catch(err) {
    /* istanbul ignore next */
    ctx.status = err.statusCode || err.status || 500;
    ctx.body = { error: err.message };
  }
});

app.use(router());

function init() {
  if(!appPromise) {
    // eslint-disable-next-line no-async-promise-executor
    appPromise = new Promise(async (resolve) => {
      await dbInit;
      app.listen(PORT, () => {
        resolve(app);
      });
    });
  }
  return appPromise;
}

init();

module.exports = init;
