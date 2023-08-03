const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');

const ModifyDocumentError = require('../errors/ModifyDocumentError');
const ValidationFailureError = require('../errors/ValidationError');
const FetchDocumentError = require('../errors/FetchDocumentError');
const ReferenceDocumentError = require('../errors/ReferenceDocumentError');
const FunctionalityError = require('../errors/FunctionalityError');
const MatchDocumentError = require('../errors/MatchDocumentError');
const VerifyValidationError = require('../errors/VerifyValidationError');


const config = require('../../config');
const JSONdata = require('../data');
const helpers = require('../helpers');
const utils = require('../utils');
const validations = require('../validations');

const models = config.DatabaseConfigurations;
const requests = helpers.Requests;
const statusCodes = JSONdata.StatusCodes
const errorCodes = JSONdata.ErrorCodes;
const sessionConfig = config.SessionConfigurations;

const Session = models.Session;


function createSession(args){
    return new Promise(async(resolve, reject) => {

        try {

            let session = {};
            const currentDate = new Date();
            const expireAt = new Date(currentDate.getTime() + (sessionConfig.sessionAliveMinutes * 60 * 1000));

            if ( args?.userId ) session.userId = args.userId;
            if ( args?.realmId ) session.realmId = args.realmId;
            if ( args?.clientId ) session.clientId = args.clientId;
            session.startAt = currentDate;
            session.expireAt = expireAt

            let newSession = await Session.create(session);
       
            return resolve(newSession);

        } catch ( error ) {
            return reject(new ModifyDocumentError(`${error}`))
        }
    })
}



function updateSession(id, updatePayload){
    return new Promise(async(resolve, reject) => {

        try {
        
            let update = {};
            if ( updatePayload?.name ) update.name = updatePayload.name;
            if ( updatePayload?.userId ) update.userId = updatePayload.userId;
            if ( updatePayload?.realmId ) update.realmId = updatePayload.realmId;
            if ( updatePayload?.clientId ) update.clientId = updatePayload.clientId;
            if ( updatePayload?.expireAt ) update.expireAt = updatePayload.expireAt;
        
            let updateAction = await Session.updateOne({_id: id}, update);
       
            if ( !updateAction?.matchedCount || updateAction.matchedCount === 0 ) return reject(new MatchDocumentError(`Failed to match session ${id} `));

            return resolve();

        } catch ( error ) {
            return reject(new ModifyDocumentError(`${error}`));
        }
    })
}


function deleteSession(id){
    return new Promise(async(resolve, reject) => {

        try {
        
            let deleteAction = await Session.deleteOne({_id: id});

            if ( !deleteAction?.deletedCount || deleteAction.deletedCount === 0 ) return reject(new MatchDocumentError(`Failed to match session ${id} `));
         
            return resolve();

        } catch ( error ) {
            return reject(new ModifyDocumentError(`${error}`))
        }
    })
}



function deleteSessions(ids){
    return new Promise(async(resolve, reject) => {

        try {
        
            let deleteAction = await Session.deleteMany({_id: { $in: ids}});

            if ( !deleteAction?.deletedCount || deleteAction.deletedCount === 0 ) return reject(new MatchDocumentError(`Failed to match any sessions`));
   
            return resolve();

        } catch ( error ) {
            return reject(new ModifyDocumentError(`${error}`))
        }
    })
}


function fetchSessions(query, options){
    return new Promise(async(resolve, reject) => {

        try {
            
            const populateOptions = options.expand;

            query = Session.find(query);

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

            const sessions = await query.exec();

            return resolve(sessions)

        } catch ( error ) {
            return reject(new FetchDocumentError(`${error}`))
        }
    })
}


function validateActiveSession(session){
    return new Promise(async(resolve, reject) => {

        try {

            const currentDate = new Date();

            const activeSession = await Session.findOne({_id: session._id, expireAt: { $gt: currentDate }})
         
            if ( !activeSession ) return reject(new VerifyValidationError('Session has expired'));

            return resolve(true);

        } catch ( error ) {
            return reject(new FunctionalityError(`${error}`))
        }
    })
}


function ExtendExpireAtTime(session){
    return new Promise(async(resolve, reject) => {

        try {

            const currentDate = new Date();
            const extendedExpireAt = new Date(currentDate.getTime() + (sessionConfig.sessionAliveMinutes * 60 * 1000));
           
            let updatedSession = await Session.updateOne(
                {
                    _id: session._id, 
                    expireAt: { $gt: currentDate }
                }, 
                { expireAt: extendedExpireAt }
            );
       
            if ( !updatedSession ) return reject(new VerifyValidationError('Unable to refresh an expired session'))

            return resolve(updatedSession);
         
        } catch ( error ) {
            return reject(new FunctionalityError(`${error}`))
        }
    })
}


function deleteExpiredSessions(userId, realmId, clientId){
    return new Promise(async(resolve, reject) => {

        try {

            const query = {userId, realmId, clientId};

            await Session.deleteMany(query);

            return resolve();
         
        } catch ( error ) {
            return reject(new ModifyDocumentError(`${error}`))
        }
    })
}


function deleteUserSessions(userId){
    return new Promise(async(resolve, reject) => {

        try {

            const query = {userId};

            await Session.deleteMany(query);

            return resolve();
         
        } catch ( error ) {
            return reject(new ModifyDocumentError(`${error}`))
        }
    })
}


module.exports = {
    createSession,
    updateSession,
    deleteSession,
    deleteSessions,
    fetchSessions,
    validateActiveSession,
    ExtendExpireAtTime,
    deleteExpiredSessions,
    deleteUserSessions,
}

