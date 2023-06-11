const mongoose = require('mongoose');

const ModifyDocumentError = require('../errors/ModifyDocumentError');
const ValidationFailureError = require('../errors/ValidationError');
const FetchDocumentError = require('../errors/FetchDocumentError');
const ReferenceDocumentError = require('../errors/ReferenceDocumentError');
const FunctionalityError = require('../errors/FunctionalityError');
const MatchDocumentError = require('../errors/MatchDocumentError');


const config = require('../../config');
const JSONdata = require('../data');
const helpers = require('../helpers');
const utils = require('../utils');
const validations = require('../validations');

const { validateActiveSessionOrReject } = require('./SessionService');
const { findRealmByNameOrReject } = require('./RealmService');
const { findClientByNameOrReject } = require('./ClientService');


const models = config.DatabaseConfigurations;
const requests = helpers.Requests;
const statusCodes = JSONdata.StatusCodes
const customCodes = JSONdata.CustomCodes;

const User = models.User;


function createUser(args){
    return new Promise(async(resolve, reject) => {

        try {

            let user = {};
            if ( args?.sub ) user.sub = args.sub;
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

            let newUser = await User.create(user);
       
            return resolve(newUser);

        } catch ( error ) {
            return reject(new ModifyDocumentError(`${error}`))
        }
    })
}


// All user informations except user's password
function getPopulatedUserById(userId){
    return new Promise((async(resolve, reject) => {
        
        try{

            const user = await User.findOne({_id: userId}, {password: 0})
                                .populate('realmId')
                                .populate('clientId')
                                .populate('roleId')
                                .populate({
                                    path: 'roleId',
                                    populate: { path: 'permissions' }
                                });

            if ( !user ) return reject(new MatchDocumentError(`Failed to match user ${userId} `));
            
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
            if ( updatePayload?.sub ) update.sub = updatePayload.sub;
            if ( updatePayload?.password ) update.password = updatePayload.password;
            if ( updatePayload?.username ) update.username = updatePayload.username;
            if ( updatePayload?.firstname ) update.firstname = updatePayload.firstname;
            if ( updatePayload?.lastname ) update.lastname = updatePayload.lastname;
            if ( updatePayload?.email ) update.email = updatePayload.email;
            if ( updatePayload?.phone && updatePayload?.phone_code ) {
                update.phone = updatePayload.phone;
                update.phone_code = updatePayload.phone_code;
            }
            if ( updatePayload?.hasOwnProperty('email_verification') ) update.email_verification = updatePayload.email_verification;
            if ( updatePayload?.hasOwnProperty('phone_verification') ) update.phone_verification = updatePayload.phone_verification;
            if ( updatePayload?.roleId ) update.roleId = updatePayload.roleId;
            if ( updatePayload?.realmId ) update.realmId = updatePayload.realmId;
            if ( updatePayload?.clientId ) update.clientId = updatePayload.clientId;
            
            let updateAction = await User.updateOne({_id: id}, update);

            if ( !updateAction?.matchedCount || updateAction.matchedCount === 0 ) return reject(new MatchDocumentError(`Failed to match user ${id} `));
       
            return resolve();

        } catch ( error ) {
            return reject(new ModifyDocumentError(`${error}`));
        }
    })
}


function deleteUser(id){
    return new Promise(async(resolve, reject) => {

        try {
        
            let deleteAction = await User.deleteOne({_id: id});
       
            if ( !deleteAction?.deletedCount || deleteAction.deletedCount === 0 ) return reject(new MatchDocumentError(`Failed to match user ${id} `));

            return resolve();

        } catch ( error ) {
            return reject(new ModifyDocumentError(`${error}`))
        }
    })
}



function deleteUsers(ids){
    return new Promise(async(resolve, reject) => {

        try {
        
            let deleteAction = await User.deleteMany({_id: { $in: ids}});

            if ( !deleteAction?.deletedCount || deleteAction.deletedCount === 0 ) return reject(new MatchDocumentError(`Failed to match any users`));
       
            return resolve();

        } catch ( error ) {
            return reject(new ModifyDocumentError(`${error}`))
        }
    })
}


function fetchUsers(query, options){
    return new Promise(async(resolve, reject) => {

        try {
            
            const populateOptions = options.expand;

            query = User.find(query);

            if ( populateOptions ) populateOptions.forEach((field) => {
                if ( !field?.includes('.') ) query = query.populate(field);
                else {
                    query = query.populate({
                        path: field.split('.')[0],
                        populate: {
                            path: field.split('.')[1]
                        }
                    });
                }
            });

            if ( options?.limit && options?.offset ) query = query.skip(options.offset).limit(options.limit)

            if (options?.fields) {
                query = query.select(options.fields);
            }

            const users = await query.exec();
            
            return resolve(users)

        } catch ( error ) {
            return reject(new FetchDocumentError(`${error}`))
        }
    })
}



function validateVerifiyReferences(realm, client){
    return new Promise(async(resolve, reject) => {

        try {
        
            if ( realm ) await findRealmByNameOrReject(realm);
            if ( client ) await findClientByNameOrReject(client);
       
            return resolve();

        } catch ( error ) {
            return reject(new FetchDocumentError(`${error}`))
        }
    })
}



function validateUserSession(token){
    return new Promise(async(resolve, reject) => {

        try {
            
            await validateActiveSessionOrReject(token);

            return resolve();

        } catch ( error ) {
            return reject(new FetchDocumentError(`${error}`))
        }
    })
}


module.exports = {
    createUser,
    getPopulatedUserById,
    updateUser,
    deleteUser,
    deleteUsers,
    fetchUsers,
    validateVerifiyReferences,
    validateUserSession,
}

