const express = require('express');
var router = express.Router();

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


        try {

            let realm = await DatabaseService.createRealm();
            let client = await DatabaseService.createClient(realm);
            let permissions = await DatabaseService.createPermissions();
            let roles = await DatabaseService.createRoles(realm, client, permissions);
            var {username, password} = await DatabaseService.createSuperadmin(realm, client, roles) 

        } catch ( error ) {
            return next(error);
        }

        console.log(`username: ${username}, password: ${password}`)
        res.locals.message = statusCodes.created.msg;
        return res.status(statusCodes.created.code).json({
            code: statusCodes.created.code, 
            message: statusCodes.created.msg,
            data: {credentials: {username, password}}
        });
});


router.route(routes.dropDatabase)
    .post(async(req, res, next) => {


        try {

            await DatabaseService.dropDatabase();

        } catch ( error ) {
            return next(error);
        }

        res.locals.message = statusCodes.ok.msg;
        return res.status(statusCodes.ok.code).json({code: statusCodes.ok.code, message: statusCodes.ok.msg});
});


module.exports = router;