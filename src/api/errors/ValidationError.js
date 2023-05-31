const statusCodes = require('../data').StatusCodes;

class ValidationFailureError extends Error {
    constructor(message) {
        super(message);
        this.code = 'ERR_VALIDATION_FAILURE';
        this.statusCode = statusCodes.unprocessable_content.code,
        this.statusMessage = statusCodes.unprocessable_content.msg;
        this.message = message
    }
}
  
module.exports = ValidationFailureError;