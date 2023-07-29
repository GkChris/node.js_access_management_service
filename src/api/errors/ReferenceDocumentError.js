const customCodes = require('../data').CustomCodes;

class ReferenceDocumentError extends Error {
    constructor(message) {
        super(message);
        this.errorMessage = customCodes.ReferenceDocumentError.message;
        this.errorCode = customCodes.ReferenceDocumentError.code,
        this.errorDetails = message
    }
}
  
module.exports = ReferenceDocumentError;