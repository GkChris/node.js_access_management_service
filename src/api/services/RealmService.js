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

const Realm = models.Realm;


function createRealm(args){
    return new Promise(async(resolve, reject) => {

        try {

            let realm = {};
            if ( args?.hasOwnProperty('name') ) realm.name = args.name;
            if ( args?.hasOwnProperty('description') ) realm.description = args.description;

            let newRealm = await Realm.create(realm);
       
            return resolve(newRealm);

        } catch ( error ) {
            return reject(new ModifyDocumentError(`${error}`))
        }
    })
}


module.exports = {
    createRealm,
}

