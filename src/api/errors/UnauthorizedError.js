const errorCodes = require('../data').ErrorCodes;

class UnauthorizedError extends Error {
    constructor(message) {
        super(message);
        this.errorMessage = errorCodes.UnauthorizedError.message;
        this.errorCode = errorCodes.UnauthorizedError.code,
        this.errorDetails = message
    }
}
  
module.exports = UnauthorizedError;