const logger = require('../utils/logger');

const errorHandler = (err, req, res, next) => {
  logger.error(err.stack);

  // Default error
  let error = {
    success: false,
    error: {
      code: 'INTERNAL_SERVER_ERROR',
      message: 'Internal server error'
    }
  };

  // Handle specific error types
  if (err.name === 'ValidationError') {
    error.error = {
      code: 'VALIDATION_ERROR',
      message: err.message
    };
  } else if (err.code === '23505') { // PostgreSQL unique violation
    error.error = {
      code: 'DUPLICATE_ENTRY',
      message: 'Resource already exists'
    };
  } else if (err.code === '23503') { // PostgreSQL foreign key violation
    error.error = {
      code: 'FOREIGN_KEY_VIOLATION',
      message: 'Referenced resource not found'
    };
  } else if (err.code === '23502') { // PostgreSQL not null violation
    error.error = {
      code: 'REQUIRED_FIELD',
      message: 'Required field is missing'
    };
  }

  res.status(500).json(error);
};

module.exports = errorHandler;
