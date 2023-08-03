const errorCodes = require('../data').ErrorCodes;

class GatewayError extends Error {
    constructor(message) {
        super(message);
        this.errorMessage = errorCodes.GatewayError.message;
        this.errorCode = errorCodes.GatewayError.code,
        this.errorDetails = message
    }
}
  
module.exports = GatewayError;