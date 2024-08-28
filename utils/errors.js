class BaseError extends Error {
  constructor(message, statusCode) {
    super(message);
    this.statusCode = statusCode;
  }
}

class NotFoundError extends BaseError {
  constructor(message = "Not found") {
    super(message, 404);
  }
}

class BadRequestError extends BaseError {
  constructor(message = "Bad request") {
    super(message, 400);
  }
}

class ConflictError extends BaseError {
  constructor(message = "Conflict") {
    super(message, 409);
  }
}

class UnauthorizedError extends BaseError {
  constructor(message = "Unauthorized") {
    super(message, 401);
  }
}

module.exports = {
  NotFoundError,
  BadRequestError,
  ConflictError,
  UnauthorizedError,
};
