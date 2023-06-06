const mongoose = require('mongoose');

const FetchDocumentError = require('../errors/FetchDocumentError');
const ModifyDocumentError = require('../errors/ModifyDocumentError');
const ReferenceDocumentError = require('../errors/ReferenceDocumentError');
const MatchDocumentError = require('../errors/MatchDocumentError');

const config = require('../../config');
const JSONdata = require('../data');
const helpers = require('../helpers');
const utils = require('../utils');

const models = config.DatabaseConfigurations;
const requests = helpers.Requests;
const statusCodes = JSONdata.StatusCodes
const customCodes = JSONdata.CustomCodes;

const Client = models.Client;

function createClient(args){
    return new Promise(async(resolve, reject) => {

        try {

            let client = {};
            if ( args?.name ) client.name = args.name; 
            if ( args?.description ) client.description = args.description; 
            if ( args?.realmId ) client.realmId = args.realmId; 

            let newClient = await Client.create(client);
       
            return resolve(newClient);

        } catch ( error ) {
            return reject(new ModifyDocumentError(`${error}`))
        }
    })
}




function updateClient(id, updatePayload){
    return new Promise(async(resolve, reject) => {

        try {
        
            let update = {};
            if ( updatePayload?.name ) update.name = updatePayload.name;
            if ( updatePayload?.description ) update.description = updatePayload.description;
            if ( updatePayload?.realmId ) update.realmId = updatePayload.realmId;
        
            let updateAction = await Client.updateOne({_id: id}, update);
       
            if ( !updateAction?.matchedCount || updateAction.matchedCount === 0 ) return reject(new MatchDocumentError(`Failed to match client ${id} `));

            return resolve();

        } catch ( error ) {
            return reject(new ModifyDocumentError(`${error}`));
        }
    })
}


function deleteClient(id){
    return new Promise(async(resolve, reject) => {

        try {
        
            let deleteAction = await Client.deleteOne({_id: id});

            if ( !deleteAction?.deletedCount || deleteAction.deletedCount === 0 ) return reject(new MatchDocumentError(`Failed to match client ${id} `));
         
            return resolve();

        } catch ( error ) {
            return reject(new ModifyDocumentError(`${error}`))
        }
    })
}



function deleteClients(ids){
    return new Promise(async(resolve, reject) => {

        try {
        
            let deleteAction = await Client.deleteMany({_id: { $in: ids}});

            if ( !deleteAction?.deletedCount || deleteAction.deletedCount === 0 ) return reject(new MatchDocumentError(`Failed to match any clients`));
   
            return resolve();

        } catch ( error ) {
            return reject(new ModifyDocumentError(`${error}`))
        }
    })
}


function fetchClientsByRealm(realmId, options){
    return new Promise(async(resolve, reject) => {

        try {
        
            let clients = [];
           
            if ( options?.populate ) clients = await Client.find({realmId}).populate('realmId');
            else clients = Client.find({realmId});

            return resolve(clients)

        } catch ( error ) {
            return reject(new ModifyDocumentError(`${error}`))
        }
    })
}


function fetchClientByRealmAndId(realmId, id, options){
    return new Promise(async(resolve, reject) => {

        try {        
            
            let clients = [];
           
            if ( options?.populate ) clients = await Client.find({realmId, id}).populate('realmId');
            else clients = Client.find({realmId, id});

            return resolve(clients)

        } catch ( error ) {
            return reject(new ModifyDocumentError(`${error}`))
        }
    })
}


function fetchAllClients(options){
    return new Promise(async(resolve, reject) => {

        try {
            
            let clients = [];
           
            if ( options?.populate ) clients = await Client.find({}).populate('realmId');
            else clients = Client.find({});

            return resolve(clients)

        } catch ( error ) {
            return reject(new ModifyDocumentError(`${error}`))
        }
    })
}



module.exports = {
    createClient,
    updateClient,
    deleteClient,
    deleteClients,
    fetchClientsByRealm,
    fetchClientByRealmAndId,
    fetchAllClients,
}