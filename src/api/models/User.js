'use strict';
const Schema = require('mongoose').Schema;

const UserSchema = new Schema({
    _id: {
        type: Schema.Types.ObjectId,
        auto: true,
        required: true,
    },
    backendId: {
        type: Schema.Types.ObjectId,
        required: true,
    },
    userId: {
        type: String,
        required: true,
        unique: true,
    },
    username: {
        type: String,
        unique,
    },
    firstname: {
        type: String,
    },
    lastname: {
        type: String,
    },
    email: {
        type: String,
        unique: true,
    },
    email_verification: {
        type: Boolean,
        default: false,
    },
    phone: {
        type: String,
        unique: true,
    },
    phone_verification: {
        type: Boolean,
        default: false
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


UserSchema.index({ backendId: 1, realmId: 1, clientId: 1 }, { unique: true });

module.exports = UserSchema;