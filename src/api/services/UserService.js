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


function createUser( 
    backendId,
    userId,
    password,
    username,
    firstname,
    lastname,
    email,
    phone,
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
            if ( username ) user.username = username;
            if ( firstname ) user.firstname = firstname;
            if ( lastname ) user.lastname = lastname;
            if ( email ) user.email = email;
            if ( phone ) user.phone = phone;
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
    createUser,
}

