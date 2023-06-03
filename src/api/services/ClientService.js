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


function createClient(args){
    return new Promise(async(resolve, reject) => {

        try {

            let client = {};
            if ( args?.name ) client.name = args.name; 
            if ( args?.description ) client.description = args.description; 
            if ( args?.realmId ) client.realmId = args.realmId; 

            let newClient = await models.Client.create(client);
       
            return resolve(newClient);

        } catch ( error ) {
            return reject(new ModifyDocumentError(`${error}`))
        }
    })
}



module.exports = {
    createClient,
}

