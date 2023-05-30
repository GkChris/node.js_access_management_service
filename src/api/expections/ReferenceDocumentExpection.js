const statusCodes = require('../data').StatusCodes;

class ReferenceDocumentException extends Error {
    constructor(message) {
        super(message);
        this.code = 'ERR_REFERENCE_DOCUMENT_EXCEPTION';
        this.statusCode = statusCodes.not_found.code,
        this.statusMessage = statusCodes.not_found.msg;
        this.message = message
    }
}
  
module.exports = ReferenceDocumentException;