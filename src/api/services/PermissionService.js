const mongoose = require('mongoose');

const ModifyDocumentError = require('../errors/ModifyDocumentError');
const FetchDocumentError = require('../errors/FetchDocumentError');

const config = require('../../config');
const JSONdata = require('../data');
const helpers = require('../helpers');
const utils = require('../utils');

const models = config.DatabaseConfigurations;
const requests = helpers.Requests;
const statusCodes = JSONdata.StatusCodes
const customCodes = JSONdata.CustomCodes;

const Permission = models.Permission;


function createPermission(name, code, description){
    return new Promise(async(resolve, reject) => {

        try {

            let permission = {};
            if ( name ) permission.name = name;
            if ( code ) permission.code = code;
            if ( description ) permission.description = description;
        
            let newPermission = await Permission.create(permission);
       
            return resolve(newPermission);

        } catch ( error ) {
            return reject(new ModifyDocumentError(`${error}`))
        }
    })
}


function updatePermission(id, updatePayload){
    return new Promise(async(resolve, reject) => {

        try {
        
            let update = {};
            if ( updatePayload?.name ) update.name = updatePayload.name;
            if ( updatePayload?.code ) update.code = updatePayload.code;
            if ( updatePayload?.description ) update.description = updatePayload.description;

            let updateAction = await Permission.updateOne({_id: id}, update);

            if ( !updateAction?.matchedCount || updateAction.matchedCount === 0 ) return reject(new MatchDocumentError(`Failed to match permission ${id} `));
       
            return resolve(updateAction);

        } catch ( error ) {
            return reject(new ModifyDocumentError(`${error}`));
        }
    })
}


function deletePermission(id){
    return new Promise(async(resolve, reject) => {

        try {
        
            let deleteAction = await Permission.deleteOne({_id: id});

            if ( !deleteAction?.deletedCount || deleteAction.deletedCount === 0 ) return reject(new MatchDocumentError(`Failed to match permission ${id} `));
       
            return resolve();

        } catch ( error ) {
            return reject(new ModifyDocumentError(`${error}`))
        }
    })
}



function deletePermissions(ids){
    return new Promise(async(resolve, reject) => {

        try {
        
            let deleteAction = await Permission.deleteMany({_id: { $in: ids}});

            if ( !deleteAction?.deletedCount || deleteAction.deletedCount === 0 ) return reject(new MatchDocumentError(`Failed to match any permissions`));
       
            return resolve();

        } catch ( error ) {
            return reject(new ModifyDocumentError(`${error}`))
        }
    })
}




function fetchPermissions(query){
    return new Promise(async(resolve, reject) => {

        try {
        
            query = Permission.find(query);

            const permissions = await query.exec();

            return resolve(permissions)

        } catch ( error ) {
            return reject(new FetchDocumentError(`${error}`))
        }
    })
}



module.exports = {
    createPermission,
    updatePermission,
    deletePermission,
    deletePermissions,
    fetchPermissions,
}

