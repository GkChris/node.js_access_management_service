const express = require('express');
var router = express.Router();

const ForbiddenError = require('../errors/ForbiddenError');

const config = require('../../config');
const JSONdata= require('../data');
const services = require('../services');
const validations = require('../validations');

const statusCodes = JSONdata.StatusCodes;

const CommonServices = services.CommonServices;
const CommonValidations = validations.CommonValidations;

const DatabaseService = services.DatabaseService;


// Module routes
const routes = {
    initializeDatabase: '/initializeDatabase$',
    dropDatabase: '/dropDatabase$',
}


router.route(routes.initializeDatabase)
    .post(async(req, res, next) => {

        const verifiedReceiver = req.verifiedReceiver;

        try {

            if ( !verifiedReceiver ) throw new ForbiddenError()

            let realms = await DatabaseService.createRealms();
            let clients = await DatabaseService.createClients(realms);
            let permissions = await DatabaseService.createPermissions();
            let roles = await DatabaseService.createRoles(realms, clients, permissions);
            var {development, production} = await DatabaseService.createSuperadmins(realms, clients, roles) 

        } catch ( error ) {
            return next(error);
        }

        console.log(`[development] -> username: ${development.username}, password: ${development.password}`)
        console.log(`[production] -> username: ${production.username}, password: ${production.password}`)
        return res.status(statusCodes.created.code).json({
            code: statusCodes.created.code, 
            message: statusCodes.created.msg,
            data: {credentials: {development, production}}
        });
});


router.route(routes.dropDatabase)
    .post(async(req, res, next) => {

        const verifiedReceiver = req.verifiedReceiver;

        try {

            if ( !verifiedReceiver ) throw new ForbiddenError()

            await DatabaseService.dropDatabase();

        } catch ( error ) {
            return next(error);
        }

        return res.status(statusCodes.ok.code).json({code: statusCodes.ok.code, message: statusCodes.ok.msg});
});


module.exports = router;