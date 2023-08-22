const axios = require('axios');

const AuthConfig = require('../../config').AuthConfigurations;
const AuthService = require('../services').AuthService;

const realm = AuthConfig.realm_name;
const client = AuthConfig.client_name;

module.exports = async (req, res, next) => {
    
    try {
        const authorizationToken = req.headers?.authorization;
     
        if ( !authorizationToken ) return next()   
        
        const auth = await AuthService.verifyUser(authorizationToken, realm, client);

        req.auth = auth;
        
        return next()
    }
    catch (error) {
        return next(error)
    }
}
