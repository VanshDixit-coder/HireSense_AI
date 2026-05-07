function notFound(req, res, next) {
  const error = new Error(`Not found - ${req.originalUrl}`);
  error.statusCode = 404;
  next(error);
}

function errorHandler(err, req, res, next) {
  let statusCode = err.statusCode || res.statusCode;
  if (!statusCode || statusCode < 400) statusCode = 500;

  if (err.name === 'CastError') {
    statusCode = 404;
    err.message = 'Resource not found';
  }

  if (err.code === 11000) {
    statusCode = 409;
    err.message = 'A record with those details already exists';
  }

  if (err.name === 'MulterError') {
    statusCode = 400;
    if (err.code === 'LIMIT_FILE_SIZE') {
      err.message = 'Resume file must be 5MB or smaller';
    }
  }

  res.status(statusCode).json({
    success: false,
    message: err.message || 'Server error',
    stack: process.env.NODE_ENV === 'production' ? undefined : err.stack
  });
}

module.exports = { notFound, errorHandler };
