const errorCodes = require('../data').ErrorCodes;

class ModifyDocumentError extends Error {
    constructor(message) {
        super(message);
        this.errorMessage = errorCodes.ModifyDocumentError.message;
        this.errorCode = errorCodes.ModifyDocumentError.code;
        this.errorDescription = errorCodes.ModifyDocumentError.description;
        this.errorDetails = message;
    }
}
  
module.exports = ModifyDocumentError;