const statusCodes = require('../data').StatusCodes;

class VerifyValidationError extends Error {
    constructor(message) {
        super(message);
        this.code = 'ERR_VERIFY_USER';
        this.statusCode = statusCodes.forbidden.code,
        this.statusMessage = statusCodes.forbidden.msg;
        this.message = message
    }
}
  
module.exports = VerifyValidationError;