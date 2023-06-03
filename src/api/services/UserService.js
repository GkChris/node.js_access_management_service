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
            const saltRounds = 14; // Number of salt rounds to apply (higher value = more secure but slower)
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


function createUser(args){
    return new Promise(async(resolve, reject) => {

        try {

            let user = {};
            if ( args?.uuid4 ) user.uuid4 = args.uuid4;
            if ( args?.password ) user.password = args.password;
            if ( args?.username ) user.username = args.username;
            if ( args?.firstname ) user.firstname = args.firstname;
            if ( args?.lastname ) user.lastname = args.lastname;
            if ( args?.email ) user.email = args.email;
            if ( args?.phone && args?.phone_code ) {
                user.phone = args.phone;
                user.phone_code = args.phone_code;
            }
            if ( args?.roleId ) user.roleId = args.roleId;
            if ( args?.realmId ) user.realmId = args.realmId;
            if ( args?.clientId ) user.clientId = args.clientId;

            let newUser = await models.User.create(user);
       
            return resolve(newUser);

        } catch ( error ) {
            return reject(new ModifyDocumentError(`${error}`))
        }
    })
}


module.exports = {
    hashPassword,
    createUser,
}

