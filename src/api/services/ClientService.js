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


function createClient(name, realmId){
    return new Promise(async(resolve, reject) => {

        try {

            let newClient = await models.Client.create({name, realmId});
       
            return resolve(newClient);

        } catch ( error ) {
            return reject(new ModifyDocumentError(`${error}`))
        }
    })
}



module.exports = {
    createClient,
}

