const AppError = require('../utils/appError');

const handleCastErrorDB = (err) => {
  const message = `Invalid ${err.path}: ${err.value}.`;
  return new AppError(message, 400);
};

const handleDuplicateFieldsDB = (err) => {
  const value = err.errmsg.match(/"([^"]+)"/)[0];
  const message = `Duplicate fields value: ${value}. Please use another value`;
  return new AppError(message, 400);
};

const handleJwtError = () => {
  return new AppError('Invalid token. Please log in again', 401);
};
const handleJwtExpiredError = () => {
  return new AppError('Your token has expired! Please log in again', 401);
};

const handleValidationErrorDB = (err) => {
  const error = Object.values(err.errors).map((el) => el.message);

  const message = `Invalid input data. ${error.join(', ')}`;
  return new AppError(message, 400);
};

const sendErrorDev = (err, req, res) => {
  // A) API
  if (req.originalUrl.startsWith('/api')) {
    return res.status(err.statusCode).json({
      status: err.status,
      error: err,
      message: err.message,
      stack: err.stack,
    });
  }

  // B) RENDERED WEBSITE
  console.log('ERROR 💥', err);
  return res.status(err.statusCode).render('error', {
    title: 'Something went wrong!',
    msg: err.message,
  });
};

const sendErrorProd = (err, req, res) => {
  // A) API
  if (req.originalUrl.startsWith('/api')) {
    // A) Opertional, trusted error: Send message to client
    if (err.isOperational) {
      return res.status(err.statusCode).json({
        status: err.status,
        message: err.message,
      });
    }
    // B) Programing or other unknow error: don't leak error details

    // 1) Log error
    console.log('ERROR 💥', err);
    // 2) Send generic message
    return res.status(500).json({
      status: 'error',
      message: 'Something went very wrong',
    });
  }

  // B) RENDERED WEBSITE
  // A) Opertional, trusted error: Send message to client
  if (err.isOperational) {
    return res.status(err.statusCode).render('error', {
      title: 'Something went wrong!',
      msg: err.message,
    });
  }
  // B) Programing or other unknow error: don't leak error details
  // 1) Log error
  console.log('ERROR 💥', err);
  // 2) Send generic message
  return res.status(err.statusCode).render('error', {
    title: 'Something went wrong!',
    msg: 'Please try again later.',
  });
};

module.exports = (err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || 'error';

  if (process.env.NODE_ENV === 'development') {
    sendErrorDev(err, req, res);
  } else if (process.env.NODE_ENV && process.env.NODE_ENV.trim() === 'production') {
    if (err.name === 'CastError') err = handleCastErrorDB(err);

    if (err.code === 11000) err = handleDuplicateFieldsDB(err);

    if (err.name === 'ValidationError') err = handleValidationErrorDB(err);

    if (err.name === 'JsonWebTokenError') err = handleJwtError();

    if (err.name === 'TokenExpiredError') err = handleJwtExpiredError();

    sendErrorProd(err, req, res);
  }
};
