const mongoose = require('mongoose');

const ModifyDocumentExpection = require('../expections/ModifyDocumentExpection');
const ValidationFailureExpection = require('../expections/ValidationExpection');
const FetchDocumentExpection = require('../expections/FetchDocumentExpection');
const ReferenceDocumentException = require('../expections/ReferenceDocumentExpection');

const config = require('../../config');
const JSONdata = require('../data');
const helpers = require('../helpers');
const utils = require('../utils');
const validations = require('../validations');

const models = config.DatabaseConfigurations;
const requests = helpers.Requests;
const statusCodes = JSONdata.StatusCodes
const customCodes = JSONdata.CustomCodes;

function find_user_references_or_reject(roleId, realmId, clientId){
    return new Promise(async(resolve, reject) => {

        try {

            let missing = [];

            let role = await models.Role.findOne({_id: roleId});
            let realm = await models.Realm.findOne({_id: realmId});
            let client = await models.Client.findOne({_id: clientId});

            if ( !role ) missing.push('Role');
            if ( !realm ) missing.push('Realm');
            if ( !client ) missing.push('Client')

            if ( missing.length > 0 ) return reject(new ReferenceDocumentException(`Failed to find user references > ${missing}`))

            return resolve(true);

        } catch ( error ) {
            return reject(new FetchDocumentExpection(`${error}`))
        }

    })
}

function createUser(user){
    return new Promise(async(resolve, reject) => {

        try {

            let newUser = await models.User.create(user);
       
            return resolve(newUser);

        } catch ( error ) {
            return reject(new ModifyDocumentExpection(`${error}`))
        }
    })
}


module.exports = {
    find_user_references_or_reject,
    createUser,
}

