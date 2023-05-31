const mongoose = require('mongoose');

const ModifyDocumentError = require('../errors/ModifyDocumentError');

const config = require('../../config');
const JSONdata = require('../data');
const helpers = require('../helpers');
const utils = require('../utils');

const models = config.DatabaseConfigurations;
const requests = helpers.Requests;
const statusCodes = JSONdata.StatusCodes
const customCodes = JSONdata.CustomCodes;


function createPermission(name, code, description){
    return new Promise(async(resolve, reject) => {

        try {

            let permission = {};
            if ( name ) permission.name = name;
            if ( code ) permission.code = code;
            if ( description ) permission.description = description;
        
            let newPermission = await models.Permission.create(permission);
       
            return resolve(newPermission);

        } catch ( error ) {
            return reject(new ModifyDocumentError(`${error}`))
        }
    })
}


module.exports = {
    createPermission,
}

