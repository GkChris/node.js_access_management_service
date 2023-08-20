const errorCodes = require('../data').ErrorCodes;

class ValidationFailureError extends Error {
    constructor(message) {
        super(message);
        this.errorMessage = errorCodes.ValidationFailureError.message;
        this.errorCode = errorCodes.ValidationFailureError.code;
        this.errorDescription = errorCodes.ValidationFailureError.description;
        this.errorDetails = message;
    }
}
  
module.exports = ValidationFailureError;