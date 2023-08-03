const errorCodes = require('../data').ErrorCodes;

class MatchDocumentError extends Error {
    constructor(message) {
        super(message);
        this.errorMessage = errorCodes.MatchDocumentError.message;
        this.errorCode = errorCodes.MatchDocumentError.code,
        this.errorDetails = message
    }
}
  
module.exports = MatchDocumentError;