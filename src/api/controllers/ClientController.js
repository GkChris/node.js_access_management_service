const express = require('express');
var router = express.Router();

const config = require('../../config');
const JSONdata= require('../data');
const services = require('../services');
const validations = require('../validations');

const statusCodes = JSONdata.StatusCodes;

const CommonSerivces = services.CommonSerivces;
const CommonValidations = validations.CommonValidations;

const ClientService = services.ClientService;


// Module routes
const routes = {
    createClient: '/createClient$',
}

router.route(routes.createClient)
    .post(async(req, res, next) => {

        const name = req.body?.data?.name ? req.body.data.name : false;
        const realmId = req.body?.data?.realmId ? req.body.data.realmId : false;

        try {
            CommonValidations.mongoose_ObjectId_validation(realmId);
            CommonValidations.is_content_missing({name, realmId});

            await ClientService.find_client_references_or_reject(realmId)

            await ClientService.createClient(name, realmId);

        } catch ( error ) {
            return next(error);
        }

        res.locals.message = statusCodes.created.msg;
        return res.status(statusCodes.created.code).json({code: statusCodes.created.code, message: statusCodes.created.msg});
});


module.exports = router;