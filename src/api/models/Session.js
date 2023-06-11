'use strict';
const Schema = require('mongoose').Schema;

const SessionSchema = new Schema({
    _id: {
        type: Schema.Types.ObjectId,
        auto: true,
        required: true,
    },
    userId: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    realmId: {
        type: Schema.Types.ObjectId,
        ref: 'Realm',
        required: true,
    },
    clientId: {
        type: Schema.Types.ObjectId,
        ref: 'Client',
        required: true,
    },
    token: {
        type: String,
        required: true,
    },
    active: {
        type: Boolean,
        required: true,
        default: true,
    }
}, { strict: true, timestamps: true });

module.exports = SessionSchema;