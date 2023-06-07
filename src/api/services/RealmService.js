const mongoose = require('mongoose');

const ModifyDocumentError = require('../errors/ModifyDocumentError');
const MatchDocumentError = require('../errors/MatchDocumentError');
const FetchDocumentError = require('../errors/FetchDocumentError');

const config = require('../../config');
const JSONdata = require('../data');
const helpers = require('../helpers');
const utils = require('../utils');

const models = config.DatabaseConfigurations;
const requests = helpers.Requests;
const statusCodes = JSONdata.StatusCodes
const customCodes = JSONdata.CustomCodes;

const Realm = models.Realm;


function createRealm(args){
    return new Promise(async(resolve, reject) => {

        try {

            let realm = {};
            if ( args?.name ) realm.name = args.name;
            if ( args?.description ) realm.description = args.description;

            let newRealm = await Realm.create(realm);
       
            return resolve(newRealm);

        } catch ( error ) {
            return reject(new ModifyDocumentError(`${error}`))
        }
    })
}



function updateRealm(id, updatePayload){
    return new Promise(async(resolve, reject) => {

        try {
        
            let update = {};
            if ( updatePayload?.name ) update.name = updatePayload.name;
            if ( updatePayload?.description ) update.description = updatePayload.description;
        
            let updateAction = await Realm.updateOne({_id: id}, update);
       
            if ( !updateAction?.matchedCount || updateAction.matchedCount === 0 ) return reject(new MatchDocumentError(`Failed to match realm ${id} `));

            return resolve();

        } catch ( error ) {
            return reject(new ModifyDocumentError(`${error}`));
        }
    })
}


function deleteRealm(id){
    return new Promise(async(resolve, reject) => {

        try {
        
            let deleteAction = await Realm.deleteOne({_id: id});

            if ( !deleteAction?.deletedCount || deleteAction.deletedCount === 0 ) return reject(new MatchDocumentError(`Failed to match realm ${id} `));
         
            return resolve();

        } catch ( error ) {
            return reject(new ModifyDocumentError(`${error}`))
        }
    })
}



function deleteRealms(ids){
    return new Promise(async(resolve, reject) => {

        try {
        
            let deleteAction = await Realm.deleteMany({_id: { $in: ids}});

            if ( !deleteAction?.deletedCount || deleteAction.deletedCount === 0 ) return reject(new MatchDocumentError(`Failed to match any realms`));
   
            return resolve();

        } catch ( error ) {
            return reject(new ModifyDocumentError(`${error}`))
        }
    })
}



function fetchRealms(query){
    return new Promise(async(resolve, reject) => {

        try {
        
            query = Realm.find(query);

            const realms = await query.exec();

            return resolve(realms)

        } catch ( error ) {
            return reject(new FetchDocumentError(`${error}`))
        }
    })
}



module.exports = {
    createRealm,
    updateRealm,
    deleteRealm,
    deleteRealms,
    fetchRealms,
}

