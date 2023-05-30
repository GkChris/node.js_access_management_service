const mongoose = require('mongoose');

const config = require('../../config');
const JSONdata = require('../data');
const helpers = require('../helpers');
const utils = require('../utils');

const models = config.DatabaseConfigurations;
const requests = helpers.Requests;
const statusCodes = JSONdata.StatusCodes
const customCodes = JSONdata.CustomCodes;


function createUser(user){
    return new Promise(async(resolve, reject) => {
        try {
            let newUser = await models.User.create(user);
            return resolve(newUser);
        } catch ( error ) {
            return reject(new Error(`${statusCodes.internal_server_error.msg} | ${error}`))
        }
    })
}


module.exports = {
    createUser,
}

