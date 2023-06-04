const express = require('express');
var router = express.Router();

const config = require('../../config');
const JSONdata= require('../data');
const services = require('../services');
const validations = require('../validations');

const statusCodes = JSONdata.StatusCodes;

const CommonServices = services.CommonServices;
const CommonValidations = validations.CommonValidations;

const ClientService = services.ClientService;


// Module routes
const routes = {
    createClient: '/createClient$',
    updateClient: '/updateClient$',
    deleteClient: '/deleteClient$',
    deleteClients: '/deleteClients$',
}

router.route(routes.createClient)
    .post(async(req, res, next) => {

        const name = req.body?.data?.hasOwnProperty('name') ? req.body.data.name : false;
        const description = req.body?.data?.hasOwnProperty('description') ? req.body.data.description : false;
        const realmId = req.body?.data?.hasOwnProperty('realmId') ? req.body.data.realmId : false;

        try {
            CommonValidations.is_content_missing({name, realmId});
            CommonValidations.mongoose_ObjectId_validation(realmId);

            await CommonServices.find_required_references_byId_or_reject([  // {Model: _id}
                {'Realm': realmId}
            ])

            await ClientService.createClient({name, description, realmId});

        } catch ( error ) {
            return next(error);
        }

        res.locals.message = statusCodes.created.msg;
        return res.status(statusCodes.created.code).json({code: statusCodes.created.code, message: statusCodes.created.msg});
});



router.route(routes.updateClient)
    .post(async(req, res, next) => {

        const id = req.body?.data?.hasOwnProperty('id') ? req.body.data.id : false;
        const payload = req.body?.data?.hasOwnProperty('payload') ? req.body.data.payload : false;

        try {
            CommonValidations.is_content_missing({id, payload});
            CommonValidations.mongoose_ObjectId_validation(id); // Throws exception if the id is missing. 

            // Find if payload contain data that should be checked for existing references
            let requiredReferences = [];
            if ( payload.realmId ) requiredReferences.push({'Role': payload.realmId});
            if ( requiredReferences.length > 0 ) await CommonServices.find_required_references_byId_or_reject(requiredReferences);

            await ClientService.updateClient(id, payload);

        } catch ( error ) {
            return next(error);
        }

        res.locals.message = statusCodes.ok.msg;
        return res.status(statusCodes.ok.code).json({code: statusCodes.ok.code, message: statusCodes.ok.msg});
});


router.route(routes.deleteClient)
    .post(async(req, res, next) => {

        const id = req.body?.data?.hasOwnProperty('id') ? req.body.data.id : false;

        try {
            CommonValidations.mongoose_ObjectId_validation(id); // Throws exception if the id is missing. 

            await ClientService.deleteClient(id);

        } catch ( error ) {
            return next(error);
        }

        res.locals.message = statusCodes.ok.msg;
        return res.status(statusCodes.ok.code).json({code: statusCodes.ok.code, message: statusCodes.ok.msg});
});



router.route(routes.deleteClients)
    .post(async(req, res, next) => {

        const ids = req.body?.data?.hasOwnProperty('ids') ? req.body.data.ids : false;

        try {
            CommonValidations.is_content_missing({ids});
            ids.forEach(id => {
                CommonValidations.mongoose_ObjectId_validation(id) 
            });

            await ClientService.deleteClient(ids);

        } catch ( error ) {
            return next(error);
        }

        res.locals.message = statusCodes.ok.msg;
        return res.status(statusCodes.ok.code).json({code: statusCodes.ok.code, message: statusCodes.ok.msg});
});


module.exports = router;