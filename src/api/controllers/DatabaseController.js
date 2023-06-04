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
    dropDatabase: '/dropDatabase$',
}

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