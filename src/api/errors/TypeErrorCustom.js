const errorCodes = require('../data').ErrorCodes;

class TypeErrorCustom extends Error {
    constructor(message) {
        super(message);
        this.errorMessage = errorCodes.TypeErrorCustom.message;
        this.errorCode = errorCodes.TypeErrorCustom.code,
        this.errorDetails = message
    }
}
  
module.exports = TypeErrorCustom;