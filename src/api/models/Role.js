'use strict';
const Schema = require('mongoose').Schema;

const RoleSchema = new Schema({
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
    permissions: [{
        type: Schema.Types.ObjectId,
        ref: 'Permission',
        required: true,
    }],
}, { strict: true, timestamps: true });

module.exports = RoleSchema;