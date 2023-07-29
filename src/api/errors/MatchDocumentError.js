const customCodes = require('../data').CustomCodes;

class MatchDocumentError extends Error {
    constructor(message) {
        super(message);
        this.errorMessage = customCodes.MatchDocumentError.message;
        this.errorCode = customCodes.MatchDocumentError.code,
        this.errorDetails = message
    }
}
  
module.exports = MatchDocumentError;