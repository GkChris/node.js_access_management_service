'use strict';
const Schema = require('mongoose').Schema;

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
    realmId: {
        type: Schema.Types.ObjectId,
        ref: 'Realm',
        required: true,
    },
}, { strict: true, timestamps: true });

module.exports = ClientSchema;