const mongoose = require('mongoose');

const FetchDocumentError = require('../errors/FetchDocumentError');
const ModifyDocumentError = require('../errors/ModifyDocumentError');
const ReferenceDocumentError = require('../errors/ReferenceDocumentError');


const config = require('../../config');
const JSONdata = require('../data');
const helpers = require('../helpers');
const utils = require('../utils');

const models = config.DatabaseConfigurations;
const requests = helpers.Requests;
const statusCodes = JSONdata.StatusCodes
const customCodes = JSONdata.CustomCodes;


function find_client_references_or_reject(realmId){
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


function createClient(name, realmId){
    return new Promise(async(resolve, reject) => {

        try {

            let newRealm = await models.Client.create({name, realmId});
       
            return resolve(newRealm);

        } catch ( error ) {
            return reject(new ModifyDocumentError(`${error}`))
        }
    })
}



module.exports = {
    find_client_references_or_reject,
    createClient,
}

