'use strict';
const mongoose = require('mongoose');

const username = 'insert_username';
const password = 'insert_password';
const dbName = 'authentication_server'; 
const dbHost = '127.0.0.1';
const dbPort = '27017';

const db = `mongodb://${username}:${password}@${dbHost}:${dbPort}/${dbName}`;

const UserSchema = require('../api/models/User');
const SessionSchema = require('../api/models/Session');
const RoleSchema = require('../api/models/Role');
const RealmSchema = require('../api/models/Realm');
const ClientSchema = require('../api/models/Client');
const PermissionSchema = require('../api/models/Permission');



// Db connection and setup
mongoose.connect(db, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => {
        console.log('Connected to MongoDB');
    })
    .catch((err) => {
        console.error('Error connecting to MongoDB:', err.message);
    });
mongoose.Promise = Promise;

module.exports.database = db;

module.exports.User = mongoose.model('User', UserSchema);
module.exports.Session = mongoose.model('Session', SessionSchema);
module.exports.Role = mongoose.model('Role', RoleSchema);
module.exports.Realm = mongoose.model('Realm', RealmSchema);
module.exports.Client = mongoose.model('Client', ClientSchema);
module.exports.Permission = mongoose.model('Permission', PermissionSchema);