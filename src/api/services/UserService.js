const mongoose = require('mongoose');
const bcrypt = require('bcrypt');


const ModifyDocumentError = require('../errors/ModifyDocumentError');
const ValidationFailureError = require('../errors/ValidationError');
const FetchDocumentError = require('../errors/FetchDocumentError');
const ReferenceDocumentError = require('../errors/ReferenceDocumentError');
const FunctionalityError = require('../errors/FunctionalityError');

const config = require('../../config');
const JSONdata = require('../data');
const helpers = require('../helpers');
const utils = require('../utils');
const validations = require('../validations');

const models = config.DatabaseConfigurations;
const requests = helpers.Requests;
const statusCodes = JSONdata.StatusCodes
const customCodes = JSONdata.CustomCodes;

function hashPassword(password){
    return new Promise((resolve, reject) => {
        try {
            const saltRounds = 12; // Number of salt rounds to apply (higher value = more secure but slower)
            bcrypt.hash(password, saltRounds, function(err, hashedPassword) {
                if (err) {
                    return reject(FunctionalityError('Something went wrong while hashing password'))
                } else {
                    return resolve(hashedPassword);
                }
            });
        } catch (error) {
            return reject(FunctionalityError('Something went wrong while hashing password'))
        }
    })      
}

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

            if ( missing.length > 0 ) return reject(new ReferenceDocumentError(`Failed to find user references: ${missing}`))

            return resolve(true);

        } catch ( error ) {
            return reject(new FetchDocumentError(`${error}`))
        }

    })
}

function createUser( 
    backendId,
    userId,
    password,
    roleId,
    realmId,
    clientId
){
    return new Promise(async(resolve, reject) => {

        try {

            let user = {};
            if ( backendId ) user.backendId = backendId;
            if ( userId ) user.userId = userId;
            if ( password ) user.password = password;
            if ( roleId ) user.roleId = roleId;
            if ( realmId ) user.realmId = realmId;
            if ( clientId ) user.clientId = clientId;

            let newUser = await models.User.create(user);
       
            return resolve(newUser);

        } catch ( error ) {
            return reject(new ModifyDocumentError(`${error}`))
        }
    })
}


module.exports = {
    hashPassword,
    find_user_references_or_reject,
    createUser,
}

