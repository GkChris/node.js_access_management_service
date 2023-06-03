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


function dropDatabase(){
    return new Promise(async(resolve, reject) => {

        try {

            await models.User.deleteMany({});
            await models.Client.deleteMany({});
            await models.Permission.deleteMany({});
            await models.Realm.deleteMany({});
            await models.Role.deleteMany({});
            await models.Session.deleteMany({});
                 
            return resolve();

        } catch ( error ) {
            return reject(new ModifyDocumentError(`${error}`))
        }
    })
}


module.exports = {
    dropDatabase,
}

