const errorCodes = require('../data').ErrorCodes;

class VerifyValidationError extends Error {
    constructor(message) {
        super(message);
        this.errorMessage = errorCodes.VerifyValidationError.message;
        this.errorCode = errorCodes.VerifyValidationError.code;
        this.errorDescription = errorCodes.VerifyValidationError.description;
        this.errorDetails = message;
    }
}
  
module.exports = VerifyValidationError;