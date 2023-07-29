const customCodes = require('../data').CustomCodes;

class FetchDocumentError extends Error {
    constructor(message) {
        super(message);
        this.errorMessage = customCodes.FetchDocumentError.message;
        this.errorCode = customCodes.FetchDocumentError.code,
        this.errorDetails = message
    }
}
  
module.exports = FetchDocumentError;