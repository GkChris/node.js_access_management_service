const jwt = require('jsonwebtoken');
const config = require('../../config');
const VerifyValidationError = require('../errors/VerifyValidationError');

const jwt_secret_key = config.Keys.jwt_secret_key;


function validateJwtToken(token){
    try {
        const secretKey = jwt_secret_key;
        const payload = jwt.verify(token, secretKey);
        return payload;
    } catch (error) {
        throw new VerifyValidationError(`${error}`);
    }
}


module.exports = validateJwtToken