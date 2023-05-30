const statusCodes = require('../data').StatusCodes;

class FetchDocumentExpection extends Error {
    constructor(message) {
        super(message);
        this.code = 'ERR_FETCH_DOCUMENT_EXCEPTION';
        this.statusCode = statusCodes.internal_server_error.code,
        this.statusMessage = statusCodes.internal_server_error.msg;
        this.message = message
    }
}
  
module.exports = FetchDocumentExpection;