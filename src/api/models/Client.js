'use strict';
const Schema = require('mongoose').Schema;
const Realm = require('./Realm'); // Import the Realm schema

const ClientSchema = new Schema({
    _id: {
        type: Schema.Types.ObjectId,
        auto: true,
        required: true,
    },
    name: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        default: ""
    },
    realmId: {
        type: Schema.Types.ObjectId,
        ref: 'Realm',
        required: true,
    },
}, { strict: true, timestamps: true });


ClientSchema.index({ name: 1, realmId: 1 }, { unique: true });
  
module.exports = ClientSchema;