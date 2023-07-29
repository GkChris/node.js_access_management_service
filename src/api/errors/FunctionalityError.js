const customCodes = require('../data').CustomCodes;

class FunctionalityError extends Error {
    constructor(message) {
        super(message);
        this.errorMessage = customCodes.FunctionalityError.message;
        this.errorCode = customCodes.FunctionalityError.code,
        this.errorDetails = message
    }
}
  
module.exports = FunctionalityError;