const mongoose = require('mongoose');

const ModifyDocumentError = require('../errors/ModifyDocumentError');
const ValidationFailureError = require('../errors/ValidationError');
const FetchDocumentError = require('../errors/FetchDocumentError');
const ReferenceDocumentError = require('../errors/ReferenceDocumentError');
const FunctionalityError = require('../errors/FunctionalityError');
const UnauthorizedError = require('../errors/UnauthorizedError');
const ForbiddenError = require('../errors/ForbiddenError');

const config = require('../../config');
const JSONdata = require('../data');
const helpers = require('../helpers');
const utils = require('../utils');
const validations = require('../validations');
const services = require('../services');

const Domains = config.Domains;
const models = config.DatabaseConfigurations;
const requests = helpers.Requests;
const statusCodes = JSONdata.StatusCodes
const errorCodes = JSONdata.ErrorCodes;

const sessionConfig = config.SessionConfigurations;
const CommonValidations = validations.CommonValidations;

const {validateVerifiyReferences} = require('../services/UserService');
const {validateActiveSession} = require('../services/SessionService');
const {ExtendExpireAtTime} = require('../services/SessionService');




function isLogged(auth){

    if ( auth?.user ) return true;
    else throw new UnauthorizedError('Action requires authorization')

}


// {user, session}, ['permission_code_1', 'permission_code_2']
function hasPermissions(auth, requiredPermissions){
    

    if ( !auth?.user ) throw new UnauthorizedError('Action requires authorization')

    const userPermissions = auth?.user?.roleId?.permissions?.map((permission) => {return permission?.code});
    let missing_permissions = [];

    for ( const permission of requiredPermissions ) {
        if ( !userPermissions?.includes(permission) ) missing_permissions.push(permission);
    }

    if ( missing_permissions.length > 0 ) throw new ForbiddenError(`Missing permissions: ${missing_permissions}`)

    return;

}


function createCookie(res, auth){
    const token = auth.token;
    const options = auth.options;

    res.cookie('authorization', token, {
        httpOnly: process.env.NODE_ENV === 'production' ? true : false,
        secure: process.env.NODE_ENV === 'production' ? true : false,
        // sameSite: 'strict',
        // other cookie options (e.g., maxAge, domain, path) if needed
        domain: Domains.MAIN_CLIENT.host,
        maxAge: options?.maxAge,
    });
    return;
    
}


function verifyUser(token, realm, client){
    return new Promise(async(resolve, reject) => {
        try {
            CommonValidations.is_content_missing({token});

            const {user, session, options} = utils.validateJwtToken(token);
         
            if ( realm || client ) await validateVerifiyReferences(realm, client); 

            await validateActiveSession(session);
            
            if ( sessionConfig.refresh_session_on_verify ) await ExtendExpireAtTime(session);

            var responseData = { user, session, options, token };

            return resolve(responseData)
        } catch ( error ) {
            return reject(error);
        }
    })
}


module.exports = {
    isLogged,
    hasPermissions,
    createCookie,
    verifyUser,
}

