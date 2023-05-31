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

function find_role_references_or_reject(realmId){
    return new Promise(async(resolve, reject) => {

        try {

            let missing = [];

            let realm = await models.Realm.findOne({_id: realmId});

            if ( !realm ) missing.push('Realm');

            if ( missing.length > 0 ) return reject(new ReferenceDocumentError(`Failed to find user references: ${missing}`))

            return resolve(true);

        } catch ( error ) {
            return reject(new FetchDocumentError(`${error}`))
        }

    })
}

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
    find_role_references_or_reject,
    createRole,
}

