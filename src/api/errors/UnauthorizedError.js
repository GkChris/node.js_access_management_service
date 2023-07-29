const customCodes = require('../data').CustomCodes;

class UnauthorizedError extends Error {
    constructor(message) {
        super(message);
        this.errorMessage = customCodes.UnauthorizedError.message;
        this.errorCode = customCodes.UnauthorizedError.code,
        this.errorDetails = message
    }
}
  
module.exports = UnauthorizedError;