const customCodes = require('../data').CustomCodes;

class ModifyDocumentError extends Error {
    constructor(message) {
        super(message);
        this.errorMessage = customCodes.ModifyDocumentError.message;
        this.errorCode = customCodes.ModifyDocumentError.code,
        this.errorDetails = message
    }
}
  
module.exports = ModifyDocumentError;