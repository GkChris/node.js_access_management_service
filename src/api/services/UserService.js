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

const User = models.User;


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
            if ( args?.hasOwnProperty('sub') ) user.sub = args.sub;
            if ( args?.hasOwnProperty('password') ) user.password = args.password;
            if ( args?.hasOwnProperty('username') ) user.username = args.username;
            if ( args?.hasOwnProperty('firstname') ) user.firstname = args.firstname;
            if ( args?.hasOwnProperty('lastname') ) user.lastname = args.lastname;
            if ( args?.hasOwnProperty('email') ) user.email = args.email;
            if ( args?.hasOwnProperty('phone') && args?.hasOwnProperty('phone_code') ) {
                user.phone = args.phone;
                user.phone_code = args.phone_code;
            }
            if ( args?.hasOwnProperty('roleId') ) user.roleId = args.roleId;
            if ( args?.hasOwnProperty('realmId') ) user.realmId = args.realmId;
            if ( args?.hasOwnProperty('clientId') ) user.clientId = args.clientId;

            let newUser = await User.create(user);
       
            return resolve(newUser);

        } catch ( error ) {
            return reject(new ModifyDocumentError(`${error}`))
        }
    })
}


// All user informations except user's password
function getUserById(userId){
    return new Promise((async(resolve, reject) => {
        try{
            const user = await User.findOne({_id: userId}, {password: 0});
            return resolve(user);
        } catch ( error ) {
            return reject(new FetchDocumentError(`${error}`));
        }
    }))
}



function updateUser(id, updatePayload){
    return new Promise(async(resolve, reject) => {

        try {
        
            let update = {};
            if ( updatePayload?.hasOwnProperty('sub') ) update.sub = updatePayload.sub;
            if ( updatePayload?.hasOwnProperty('password') ) update.password = updatePayload.password;
            if ( updatePayload?.hasOwnProperty('username') ) update.username = updatePayload.username;
            if ( updatePayload?.hasOwnProperty('firstname') ) update.firstname = updatePayload.firstname;
            if ( updatePayload?.hasOwnProperty('lastname') ) update.lastname = updatePayload.lastname;
            if ( updatePayload?.hasOwnProperty('email') ) update.email = updatePayload.email;
            if ( updatePayload?.hasOwnProperty('phone') && updatePayload?.hasOwnProperty('phone_code') ) {
                update.phone = updatePayload.phone;
                update.phone_code = updatePayload.phone_code;
            }
            if ( updatePayload?.hasOwnProperty('email_verification') ) update.email_verification = updatePayload.email_verification;
            if ( updatePayload?.hasOwnProperty('phone_verification') ) update.phone_verification = updatePayload.phone_verification;
            if ( updatePayload?.hasOwnProperty('roleId') ) update.roleId = updatePayload.roleId;
            if ( updatePayload?.hasOwnProperty('realmId') ) update.realmId = updatePayload.realmId;
            if ( updatePayload?.hasOwnProperty('clientId') ) update.clientId = updatePayload.clientId;
            console.log('UPDATW',updatePayload);
            let updatedUser = await User.updateOne({_id: id}, update, {returnOriginal: false});
       
            return resolve(updatedUser);

        } catch ( error ) {
            return reject(new ModifyDocumentError(`${error}`));
        }
    })
}


function deleteUser(id){
    return new Promise(async(resolve, reject) => {

        try {
        
            await User.deleteOne({_id: id});
       
            return resolve();

        } catch ( error ) {
            return reject(new ModifyDocumentError(`${error}`))
        }
    })
}



function deleteUsers(ids){
    return new Promise(async(resolve, reject) => {

        try {
        
            await User.deleteMany({_id: { $in: ids}});
       
            return resolve();

        } catch ( error ) {
            return reject(new ModifyDocumentError(`${error}`))
        }
    })
}



module.exports = {
    hashPassword,
    createUser,
    getUserById,
    updateUser,
    deleteUser,
    deleteUsers,
}

