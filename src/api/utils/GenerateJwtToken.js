const jwt = require('jsonwebtoken');
const config = require('../../config');
const FunctionalityError = require("../errors/FunctionalityError");

const jwt_secret_key = config.Keys.jwt_secret_key;


function generateJwtToken(user, options){
    try {

        const payload = JSON.stringify(user);
        const secretKey = jwt_secret_key;

        const token = jwt.sign(payload, secretKey, options);

        return token
    } catch ( error ) {
        throw new FunctionalityError(`${error}`);
    }
}


module.exports = generateJwtToken