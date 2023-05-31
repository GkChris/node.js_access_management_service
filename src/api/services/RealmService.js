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


function createRealm(name){
    return new Promise(async(resolve, reject) => {

        try {

            let newRealm = await models.Realm.create({name});
       
            return resolve(newRealm);

        } catch ( error ) {
            return reject(new ModifyDocumentError(`${error}`))
        }
    })
}


module.exports = {
    createRealm,
}

