const errorCodes = require('../data').ErrorCodes;

class ForbiddenError extends Error {
    constructor(message) {
        super(message);
        this.errorMessage = errorCodes.ForbiddenError.message;
        this.errorCode = errorCodes.ForbiddenError.code,
        this.errorDetails = message
    }
}
  
module.exports = ForbiddenError;