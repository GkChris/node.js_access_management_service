const axios = require('axios');

const config = require('../../config');

const serverSecretKey = config.Keys.secret_server_key;

const AuthConfig = config.AuthConfigurations;
const AuthService = require('../services').AuthService;

const realm = AuthConfig.realm_name;
const client = AuthConfig.client_name;

module.exports = async (req, res, next) => {
    
    try {
        const authorizationToken = req.headers?.authorization;
        const isReceiverVerified = authorizationToken && authorizationToken === serverSecretKey ? true : false;

        if ( !authorizationToken ) return next()   
        
        if ( isReceiverVerified ) {
            req.isReceiverVerified = true;
            return next();
        }

        const auth = await AuthService.verifyUser(authorizationToken, realm, client);

        req.auth = auth;
        
        return next()
    }
    catch (error) {
        return next(error)
    }
}
