'use strict';
const Schema = require('mongoose').Schema;

const UserSchema = new Schema({
    _id: {
        type: Schema.Types.ObjectId,
        auto: true,
        required: true,
    },
    uuid4: {
        type: String,
        required: true,
        unique: true,
    },
    username: {
        type: String,
        required: true,
        unique: true,
    },
    firstname: {
        type: String,
        default: "",
    },
    lastname: {
        type: String,
        default: "",
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
    phone_code: {
        type: String,
    },
    phone_verification: {
        type: Boolean,
        default: false
    },
    password: {
        type: String,
        default: "",
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


UserSchema.index({ username: 1, realmId: 1, clientId: 1 }, { unique: true });

module.exports = UserSchema;