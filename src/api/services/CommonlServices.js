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
const errorCodes = JSONdata.ErrorCodes;

// [{Model: _id}]
function find_required_references_byId_or_reject(args){
    return new Promise(async(resolve, reject) => {

        try {

            let missing = [];

            for ( let arg of args ) {
                let model = Object.keys(arg)[0];
                let id = Object.values(arg)[0];

                let item = await models[model].findOne({_id: id});
                if ( !item ) missing.push(model);
            }

            if ( missing.length > 0 ) return reject(new ReferenceDocumentError(`Failed to find user references: ${missing}`))

            return resolve(true);

        } catch ( error ) {
            return reject(new FetchDocumentError(`${error}`))
        }

    })
}
// db.collection.find({ field: { $regex: /apple/i } });



// { field: value }, { name: Chris }
function appendFiltersToQuery(query, filters){
        
    try {

        for ( let filter of Object.entries(filters) ){
      
            const field = filter[0];
            const value = filter[1];
            const regex = new RegExp(value, 'i');

            query[field] = { $regex: regex };
                
        }
        
        return query;

    } catch ( error ) {
        throw new FetchDocumentError(`${error}`)
    }

}


module.exports = {
    find_required_references_byId_or_reject,
    appendFiltersToQuery,
}

