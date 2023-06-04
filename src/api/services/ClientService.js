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

const Client = models.Client;


function createClient(args){
    return new Promise(async(resolve, reject) => {

        try {

            let client = {};
            if ( args?.hasOwnProperty('name') ) client.name = args.name; 
            if ( args?.hasOwnProperty('description') ) client.description = args.description; 
            if ( args?.hasOwnProperty('realmId') ) client.realmId = args.realmId; 

            let newClient = await Client.create(client);
       
            return resolve(newClient);

        } catch ( error ) {
            return reject(new ModifyDocumentError(`${error}`))
        }
    })
}



module.exports = {
    createClient,
}

