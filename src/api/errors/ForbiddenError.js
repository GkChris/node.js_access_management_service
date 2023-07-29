const customCodes = require('../data').CustomCodes;

class ForbiddenError extends Error {
    constructor(message) {
        super(message);
        this.errorMessage = customCodes.ForbiddenError.message;
        this.errorCode = customCodes.ForbiddenError.code,
        this.errorDetails = message
    }
}
  
module.exports = ForbiddenError;