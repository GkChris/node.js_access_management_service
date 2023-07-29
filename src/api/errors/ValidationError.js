const customCodes = require('../data').CustomCodes;

class ValidationFailureError extends Error {
    constructor(message) {
        super(message);
        this.errorMessage = customCodes.ValidationFailureError.message;
        this.errorCode = customCodes.ValidationFailureError.code,
        this.errorDetails = message
    }
}
  
module.exports = ValidationFailureError;