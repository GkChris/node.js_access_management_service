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

function fetchClients(query, options){
    return new Promise(async(resolve, reject) => {

        try {
            
            const populateOptions = options.expand;

            query = Client.find(query);

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

            const clients = await query.exec();

            return resolve(clients)

        } catch ( error ) {
            return reject(new FetchDocumentError(`${error}`))
        }
    })
}



function findClientByNameOrReject(name){
    return new Promise(async(resolve, reject) => {

        try {
        
            const client = await Client.findOne({name});

            if ( !client ) return reject(new MatchDocumentError(`Failed to match client by name: ${name}`))

            return resolve(client);

        } catch ( error ) {
            return reject(new FetchDocumentError(`${error}`))
        }
    })
}



module.exports = {
    createClient,
    updateClient,
    deleteClient,
    deleteClients,
    fetchClients,
    findClientByNameOrReject,
}