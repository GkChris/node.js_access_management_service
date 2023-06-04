const statusCodes = require('../data').StatusCodes;

class MatchDocumentError extends Error {
    constructor(message) {
        super(message);
        this.code = 'ERR_MATCH_DOCUMENT';
        this.statusCode = statusCodes.not_found.code,
        this.statusMessage = statusCodes.not_found.msg;
        this.message = message
    }
}
  
module.exports = MatchDocumentError;