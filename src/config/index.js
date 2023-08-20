'use strict';
const dotenv = require('dotenv')

process.env.NODE_ENV = process.env.NODE_ENV || 'development';

const env = dotenv.config({ path: `.env.${process.env.NODE_ENV}` })

if (env.hasOwnProperty('error')) throw new Error('No .env file!');

const AppConfigurations = require('./AppConfigurations');
const DatabaseConfigurations = require('./DatabaseConfiguration');
const CacheConfigurations = require('./CacheConfigurations');
const MqttConfigurations = require('./MqttConfigurations');
const Keys = require('./Keys');
const Domains = require('./Domains');
const Validations = require('./Validations');
const ErrorHandlerConfigurations = require('./ErrorHandlerConfigurations')
const SessionConfigurations = require('./SessionConfigurations');
const MiddlewareConfigurations = require('./MiddlewareConfigurations');

module.exports = {
    AppConfigurations,
    DatabaseConfigurations,
    CacheConfigurations,
    MqttConfigurations,
    Keys,
    Domains,
    Validations,
    ErrorHandlerConfigurations,
    SessionConfigurations,
    MiddlewareConfigurations,
};


