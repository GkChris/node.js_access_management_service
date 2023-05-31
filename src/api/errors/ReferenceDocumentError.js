const statusCodes = require('../data').StatusCodes;

class ReferenceDocumentError extends Error {
    constructor(message) {
        super(message);
        this.code = 'ERR_REFERENCE_DOCUMENT';
        this.statusCode = statusCodes.not_found.code,
        this.statusMessage = statusCodes.not_found.msg;
        this.message = message
    }
}
  
module.exports = ReferenceDocumentError;