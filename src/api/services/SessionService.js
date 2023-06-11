const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');

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

const models = config.DatabaseConfigurations;
const requests = helpers.Requests;
const statusCodes = JSONdata.StatusCodes
const customCodes = JSONdata.CustomCodes;

const Session = models.Session;


function createSession(args){
    return new Promise(async(resolve, reject) => {

        try {

            let session = {};
            if ( args?.userId ) session.userId = args.userId;
            if ( args?.realmId ) session.realmId = args.realmId;
            if ( args?.clientId ) session.clientId = args.clientId;
            if ( args?.token ) session.token = args.token; 

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
            if ( updatePayload?.token ) update.token = updatePayload.token;
            if ( updatePayload?.hasOwnProperty('active') ) update.active = updatePayload.active;
        
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


function validateActiveSessionOrReject(token){
    return new Promise(async(resolve, reject)=> {

        try {

            const session = await Session.findOne({token, active: true});

            return resolve(session);

        } catch ( error ) {
            return reject(new MatchDocumentError(`Failed to find an active session for the given token`));
        }

    })
}


module.exports = {
    createSession,
    updateSession,
    deleteSession,
    deleteSessions,
    fetchSessions,
    validateActiveSessionOrReject,
}

