'use strict';
const Schema = require('mongoose').Schema;

const UserSchema = new Schema({
    _id: {
        type: Schema.Types.ObjectId,
        auto: true,
        required: true,
    },
    userId: {
        type: String,
        required: true,
    },
    password: {
        type: String,
    },
    roleId: {
        type: Schema.Types.ObjectId,
        ref: 'Role',
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
}, { strict: true, timestamps: true });


UserSchema.index({ userId: 1, realmId: 1, clientId: 1 }, { unique: true });

module.exports = UserSchema;