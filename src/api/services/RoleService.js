const mongoose = require('mongoose');

const ModifyDocumentError = require('../errors/ModifyDocumentError');
const ValidationFailureError = require('../errors/ValidationError');
const FetchDocumentError = require('../errors/FetchDocumentError');
const ReferenceDocumentError = require('../errors/ReferenceDocumentError');

const config = require('../../config');
const JSONdata = require('../data');
const helpers = require('../helpers');
const utils = require('../utils');
const validations = require('../validations');

const models = config.DatabaseConfigurations;
const requests = helpers.Requests;
const statusCodes = JSONdata.StatusCodes
const customCodes = JSONdata.CustomCodes;


function createRole(name, realmId, permissions){
    return new Promise(async(resolve, reject) => {

        try {

            let role = {};
            if ( name ) role.name = name;
            if ( realmId ) role.realmId = realmId;
            if ( permissions && permissions?.length > 0 ) role.permissions = permissions; 

            let newRole = await models.Role.create(role);
       
            return resolve(newRole);

        } catch ( error ) {
            return reject(new ModifyDocumentError(`${error}`))
        }
    })
}


module.exports = {
    createRole,
}

