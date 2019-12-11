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
class NotFoundError extends Error {
  constructor(message) {
    super(message);
    this.code = 'not_found';
  }
}

function handleError(ctx, err) {
  /* istanbul ignore next */
  if(err.code && err.code === 11000) {
    const error = new Error('Duplicate values &{err.value}');
    ctx.throw(409, error);
  } else if(err.name && err.name === 'CastError') {
    const error = new Error(`Document with id ${err.value} not found`);
    ctx.throw(404, error);
  } else if(err.name && err.name === 'ValidationError') {
    const error = new Error(Object.values(err.errors).map((e) => e.message));
    ctx.throw(422, error);
  } else if(err.code === 'conflict') {
    ctx.throw(401, err);
  } else if(err.code === 'request_error') {
    ctx.throw(400, err);
  } else if(err.code === 'not_found') {
    ctx.throw(404, err);
  }
  /* istanbul ignore next */
  return ctx.throw(500, err);
}

module.exports = {
  RequestError,
  ConflictError,
  NotFoundError,
  handleError,
};
