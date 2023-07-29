const customCodes = require('../data').CustomCodes;

class TypeErrorCustom extends Error {
    constructor(message) {
        super(message);
        this.errorMessage = customCodes.TypeErrorCustom.message;
        this.errorCode = customCodes.TypeErrorCustom.code,
        this.errorDetails = message
    }
}
  
module.exports = TypeErrorCustom;