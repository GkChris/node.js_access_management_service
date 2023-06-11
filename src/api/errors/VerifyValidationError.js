const statusCodes = require('../data').StatusCodes;

class VerifyValidationError extends Error {
    constructor(message) {
        super(message);
        this.code = 'ERR_VERIFY_USER';
        this.statusCode = statusCodes.internal_server_error.code,
        this.statusMessage = statusCodes.internal_server_error.msg;
        this.message = message
    }
}
  
module.exports = VerifyValidationError;