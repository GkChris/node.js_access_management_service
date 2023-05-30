const statusCodes = require('../data').StatusCodes;

class ModifyDocumentExpection extends Error {
    constructor(message) {
        super(message);
        this.code = 'ERR_MODIFY_DOCUMENT_EXCEPTION';
        this.statusCode = statusCodes.internal_server_error.code,
        this.statusMessage = statusCodes.internal_server_error.msg;
        this.message = message
    }
}
  
module.exports = ModifyDocumentExpection;