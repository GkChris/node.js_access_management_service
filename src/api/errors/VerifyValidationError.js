const customCodes = require('../data').CustomCodes;

class VerifyValidationError extends Error {
    constructor(message) {
        super(message);
        this.errorMessage = customCodes.VerifyValidationError.message;
        this.errorCode = customCodes.VerifyValidationError.code,
        this.errorDetails = message
    }
}
  
module.exports = VerifyValidationError;