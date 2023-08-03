const errorCodes = require('../data').ErrorCodes;

class ReferenceDocumentError extends Error {
    constructor(message) {
        super(message);
        this.errorMessage = errorCodes.ReferenceDocumentError.message;
        this.errorCode = errorCodes.ReferenceDocumentError.code,
        this.errorDetails = message
    }
}
  
module.exports = ReferenceDocumentError;