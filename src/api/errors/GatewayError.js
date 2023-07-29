const customCodes = require('../data').CustomCodes;

class GatewayError extends Error {
    constructor(message) {
        super(message);
        this.errorMessage = customCodes.GatewayError.message;
        this.errorCode = customCodes.GatewayError.code,
        this.errorDetails = message
    }
}
  
module.exports = GatewayError;