const errorCodes = require('../data').ErrorCodes;

class RequestError extends Error {
    constructor(message) {
        super(message);
        this.errorMessage = errorCodes.RequestError.message;
        this.errorCode = errorCodes.RequestError.code;
        this.errorDescription = errorCodes.RequestError.description;
        this.errorDetails = message;
    }
}
  
module.exports = RequestError;