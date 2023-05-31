const statusCodes = require('../data').StatusCodes;

class TypeErrorCustom extends Error {
    constructor(message) {
        super(message);
        this.code = 'ERR_TYPE_ERROR';
        this.statusCode = statusCodes.internal_server_error.code,
        this.statusMessage = statusCodes.internal_server_error.msg;
        this.message = message
    }
}
  
module.exports = TypeErrorCustom;