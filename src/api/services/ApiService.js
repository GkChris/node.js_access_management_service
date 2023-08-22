const mongoose = require('mongoose');

const ModifyDocumentError = require('../errors/ModifyDocumentError');
const ValidationFailureError = require('../errors/ValidationError');
const FetchDocumentError = require('../errors/FetchDocumentError');
const ReferenceDocumentError = require('../errors/ReferenceDocumentError');
const FunctionalityError = require('../errors/FunctionalityError');
const UnauthorizedError = require('../errors/UnauthorizedError');
const ForbiddenError = require('../errors/ForbiddenError');

const config = require('../../config');
const JSONdata = require('../data');
const helpers = require('../helpers');
const utils = require('../utils');
const validations = require('../validations');
const services = require('../services');

const Domains = config.Domains;
const models = config.DatabaseConfigurations;
const requests = helpers.Requests;
const statusCodes = JSONdata.StatusCodes
const errorCodes = JSONdata.ErrorCodes;

const sessionConfig = config.SessionConfigurations;
const CommonValidations = validations.CommonValidations;

const Realm = models.Realm;
const Client = models.Client;
const Role = models.Role;


function fetchRequiredIds(realmName, clientName, roleName){
    return new Promise(async(resolve, reject) => {
        try {
         
            const realm = await Realm.findOne({name: realmName}).select('_id');; 
            const realmId = realm._id;

            const client = await Client.findOne({realmId, name: clientName}).select('_id');;
            const clientId = client._id;

            const role = await Role.findOne({realmId, clientId, name: roleName}).select('_id');;
            const roleId = role._id;

            return resolve({ realmId, clientId, roleId })
        } catch ( error ) {
            return reject(new FetchDocumentError(`${error}`));
        }
    })
}


module.exports = {
    fetchRequiredIds,
}

