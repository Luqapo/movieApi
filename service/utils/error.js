/* eslint-disable max-classes-per-file */
class RequestError extends Error {
  constructor(message) {
    super(message);
    this.code = 'request_error';
  }
}
class ConflictError extends Error {
  constructor(message) {
    super(message);
    this.code = 'conflict';
  }
}

function handleError(ctx, err) {
  if(err.name && err.name === 'ValidationError') {
    const error = new Error(Object.values(err.errors).map((e) => e.message));
    ctx.throw(422, error);
  } else if(err.code === 'conflict') {
    ctx.throw(409, err);
  } else if(err.code === 'request_error') {
    ctx.throw(400, err);
  }
  /* istanbul ignore next */
  return ctx.throw(500, err);
}

module.exports = {
  RequestError,
  ConflictError,
  handleError,
};
