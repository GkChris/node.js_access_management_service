const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');

const ModifyDocumentError = require('../errors/ModifyDocumentError');
const ValidationFailureError = require('../errors/ValidationError');
const FetchDocumentError = require('../errors/FetchDocumentError');
const ReferenceDocumentError = require('../errors/ReferenceDocumentError');
const FunctionalityError = require('../errors/FunctionalityError');

const config = require('../../config');
const JSONdata = require('../data');
const helpers = require('../helpers');
const utils = require('../utils');
const validations = require('../validations');

const models = config.DatabaseConfigurations;
const requests = helpers.Requests;
const statusCodes = JSONdata.StatusCodes
const customCodes = JSONdata.CustomCodes;

const jwt_secret_key = config.Keys.jwt_secret_key;


function generateJwtToken(user){
    try {

        const payload = JSON.stringify(user);
        const secretKey = jwt_secret_key;
        const options = {};

        const token = jwt.sign(payload, secretKey, options);

        return token
    } catch ( error ) {
        throw new FunctionalityError(`${error}`);
    }
}

function createSession(args){
    return new Promise(async(resolve, reject) => {

        try {

            let session = {};
            if ( args?.userId ) session.userId = args.userId;
            if ( args?.realmId ) session.realmId = args.realmId;
            if ( args?.clientId ) session.clientId = args.clientId;
            if ( args?.token ) session.token = args.token; 

            let newSession = await models.Session.create(session);
       
            return resolve(newSession);

        } catch ( error ) {
            return reject(new ModifyDocumentError(`${error}`))
        }
    })
}


module.exports = {
    createSession,
    generateJwtToken,
}

