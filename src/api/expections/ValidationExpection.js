const statusCodes = require('../data').StatusCodes;

class ValidationFailureExpection extends Error {
    constructor(message) {
        super(message);
        this.code = 'ERR_VALIDATION_FAILURE_EXCEPTION';
        this.statusCode = statusCodes.unprocessable_content.code,
        this.statusMessage = statusCodes.unprocessable_content.msg;
        this.message = message
    }
}
  
module.exports = ValidationFailureExpection;