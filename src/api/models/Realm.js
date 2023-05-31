'use strict';
const Schema = require('mongoose').Schema;

const RealmSchema = new Schema({
    _id: {
        type: Schema.Types.ObjectId,
        auto: true,
        required: true,
    },
    name: {
        type: String,
        required: true,
        unique: true,
    },
}, { strict: true, timestamps: true });

module.exports = RealmSchema;