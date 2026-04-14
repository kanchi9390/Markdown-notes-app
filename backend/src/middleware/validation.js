const Joi = require('joi');

const noteSchema = Joi.object({
  title: Joi.string().required().min(1).max(255).trim(),
  content: Joi.string().optional().max(1048576).allow('')
});

const uuidSchema = Joi.string().uuid().required();

const searchSchema = Joi.object({
  q: Joi.string().required().min(1).max(255).trim()
});

const bulkDeleteSchema = Joi.object({
  noteIds: Joi.array().items(Joi.string().uuid()).min(1).required()
});

const validateNote = (req, res, next) => {
  const { error } = noteSchema.validate(req.body);
  if (error) {
    return res.status(400).json({
      success: false,
      error: {
        code: 'VALIDATION_ERROR',
        message: error.details[0].message,
        details: error.details
      }
    });
  }
  next();
};

const validateUUID = (req, res, next) => {
  const { error } = uuidSchema.validate(req.params.id);
  if (error) {
    return res.status(400).json({
      success: false,
      error: {
        code: 'VALIDATION_ERROR',
        message: 'Invalid ID format'
      }
    });
  }
  next();
};


const validateSearch = (req, res, next) => {
  const { error, value } = searchSchema.validate(req.query);
  if (error) {
    return res.status(400).json({
      success: false,
      error: {
        code: 'VALIDATION_ERROR',
        message: error.details[0].message
      }
    });
  }
  req.query = { ...req.query, ...value };
  next();
};

const validateBulkDelete = (req, res, next) => {
  const { error } = bulkDeleteSchema.validate(req.body);
  if (error) {
    return res.status(400).json({
      success: false,
      error: {
        code: 'VALIDATION_ERROR',
        message: error.details[0].message,
        details: error.details
      }
    });
  }
  next();
};

module.exports = {
  validateNote,
  validateUUID,
  validateSearch,
  validateBulkDelete
};
