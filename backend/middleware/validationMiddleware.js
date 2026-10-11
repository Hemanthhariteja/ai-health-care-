const { validationResult } = require('express-validator');
const { errorResponse } = require('../utils/responseUtils');

const validate = (validators) => {
  return async (req, res, next) => {
    // Run all validators
    await Promise.all(validators.map(validator => validator.run(req)));
    
    const errors = validationResult(req);
    
    if (!errors.isEmpty()) {
      const extractedErrors = errors.array().map(err => ({
        field: err.param,
        message: err.msg
      }));
      
      return errorResponse(res, 'Validation failed', 400, extractedErrors);
    }
    
    next();
  };
};

module.exports = { validate };
