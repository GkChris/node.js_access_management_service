const mongoose = require('mongoose');

const ModifyDocumentError = require('../errors/ModifyDocumentError');
const ValidationFailureError = require('../errors/ValidationError');
const FetchDocumentError = require('../errors/FetchDocumentError');
const ReferenceDocumentError = require('../errors/ReferenceDocumentError');
const MatchDocumentError = require('../errors/MatchDocumentError');

const config = require('../../config');
const JSONdata = require('../data');
const helpers = require('../helpers');
const utils = require('../utils');
const validations = require('../validations');

const models = config.DatabaseConfigurations;
const requests = helpers.Requests;
const statusCodes = JSONdata.StatusCodes
const errorCodes = JSONdata.ErrorCodes;

const Role = models.Role;


function createRole(args){
    return new Promise(async(resolve, reject) => {

        try {

            let role = {};
            if ( args?.name ) role.name = args.name;
            if ( args?.description ) role.description = args.description;
            if ( args?.realmId ) role.realmId = args.realmId;
            if ( args?.clientId ) role.clientId = args.clientId;
            if ( args?.permissions && args.permissions?.length > 0 ) role.permissions = args.permissions; 

            let newRole = await Role.create(role);
            
            return resolve(newRole);

        } catch ( error ) {
            return reject(new ModifyDocumentError(`${error}`))
        }
    })
}




function updateRole(id, updatePayload){
    return new Promise(async(resolve, reject) => {

        try {
        
            let update = {};
            if ( updatePayload?.name ) update.name = updatePayload.name;
            if ( updatePayload?.description ) update.description = updatePayload.description;
            if ( updatePayload?.realmId ) update.realmId = updatePayload.realmId;
            if ( updatePayload?.clientId ) update.clientId = updatePayload.clientId;
            if ( updatePayload?.permissions ) update.permissions = updatePayload.permissions;
        
            let updateAction = await Role.updateOne({_id: id}, update);
       
            if ( !updateAction?.matchedCount || updateAction.matchedCount === 0 ) return reject(new MatchDocumentError(`Failed to match role ${id} `));

            return resolve();

        } catch ( error ) {
            return reject(new ModifyDocumentError(`${error}`));
        }
    })
}


function deleteRole(id){
    return new Promise(async(resolve, reject) => {

        try {
        
            let deleteAction = await Role.deleteOne({_id: id});

            if ( !deleteAction?.deletedCount || deleteAction.deletedCount === 0 ) return reject(new MatchDocumentError(`Failed to match role ${id} `));
         
            return resolve();

        } catch ( error ) {
            return reject(new ModifyDocumentError(`${error}`))
        }
    })
}



function deleteRoles(ids){
    return new Promise(async(resolve, reject) => {

        try {
        
            let deleteAction = await Role.deleteMany({_id: { $in: ids}});

            if ( !deleteAction?.deletedCount || deleteAction.deletedCount === 0 ) return reject(new MatchDocumentError(`Failed to match any roles`));
   
            return resolve();

        } catch ( error ) {
            return reject(new ModifyDocumentError(`${error}`))
        }
    })
}




function fetchRoles(query, options){
    return new Promise(async(resolve, reject) => {

        try {
            
            const populateOptions = options.expand;

            query = Role.find(query);

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

            const roles = await query.exec();

            return resolve(roles)

        } catch ( error ) {
            return reject(new FetchDocumentError(`${error}`))
        }
    })
}



module.exports = {
    createRole,
    updateRole,
    deleteRole,
    deleteRoles,
    fetchRoles,
}