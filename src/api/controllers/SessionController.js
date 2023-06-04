const express = require('express');
var router = express.Router();

const config = require('../../config');
const JSONdata= require('../data');
const services = require('../services');
const utils = require('../utils');
const validations = require('../validations');

const statusCodes = JSONdata.StatusCodes;

const CommonServices = services.CommonServices;
const CommonValidations = validations.CommonValidations;

const SessionService = services.SessionService;
const UserService = services.UserService;

// Module routes
const routes = {
    createSession: '/createSession$',
    updateSession: '/updateSession$',
    deleteSession: '/deleteSession$',
    deleteSessions: '/deleteSessions$',
}

router.route(routes.createSession)
    .post(async(req, res, next) => {

        const userId = req.body?.data?.hasOwnProperty('userId') ? req.body.data.userId : false;
        const realmId = req.body?.data?.hasOwnProperty('realmId') ? req.body.data.realmId : false;
        const clientId = req.body?.data?.hasOwnProperty('clientId') ? req.body.data.clientId : false;

        try {
            CommonValidations.is_content_missing({userId, realmId, clientId});
            CommonValidations.mongoose_ObjectId_validation(userId);
            CommonValidations.mongoose_ObjectId_validation(realmId);
            CommonValidations.mongoose_ObjectId_validation(clientId);

            await CommonServices.find_required_references_byId_or_reject([  // {Model: _id}
                {'User': userId},
                {'Realm': realmId},
                {'Client': clientId}
            ])

            const user = await UserService.getUserById(userId);     // Does not include user's password
            const token = utils.generateJwtToken(user, {}); // payload, options

            var session = await SessionService.createSession({userId, realmId, clientId, token});

        } catch ( error ) {
            return next(error);
        }

        res.locals.message = statusCodes.created.msg;
        return res.status(statusCodes.created.code).json({
            code: statusCodes.created.code, 
            message: statusCodes.created.msg,
            data: {token: session.token}
        });
});


router.route(routes.updateSession)
    .post(async(req, res, next) => {

        const id = req.body?.data?.hasOwnProperty('id') ? req.body.data.id : false;
        const payload = req.body?.data?.hasOwnProperty('payload') ? req.body.data.payload : false;

        try {
            CommonValidations.is_content_missing({id, payload});
            CommonValidations.mongoose_ObjectId_validation(id); // Throws exception if the id is missing. 

            // Find if payload contain data that should be checked for existing references
            let requiredReferences = [];
            if ( payload.realmId ) requiredReferences.push({'Role': payload.realmId});
            if ( payload.clientId ) requiredReferences.push({'Role': payload.clientId});
            if ( requiredReferences.length > 0 ) await CommonServices.find_required_references_byId_or_reject(requiredReferences);

            await SessionService.updateSession(id, payload);

        } catch ( error ) {
            return next(error);
        }

        res.locals.message = statusCodes.ok.msg;
        return res.status(statusCodes.ok.code).json({code: statusCodes.ok.code, message: statusCodes.ok.msg});
});


router.route(routes.deleteSession)
    .post(async(req, res, next) => {

        const id = req.body?.data?.hasOwnProperty('id') ? req.body.data.id : false;

        try {
            CommonValidations.mongoose_ObjectId_validation(id); // Throws exception if the id is missing. 

            await SessionService.deleteSession(id);

        } catch ( error ) {
            return next(error);
        }

        res.locals.message = statusCodes.ok.msg;
        return res.status(statusCodes.ok.code).json({code: statusCodes.ok.code, message: statusCodes.ok.msg});
});



router.route(routes.deleteSessions)
    .post(async(req, res, next) => {

        const ids = req.body?.data?.hasOwnProperty('ids') ? req.body.data.ids : false;

        try {
            CommonValidations.is_content_missing({ids});
            ids.forEach(id => {
                CommonValidations.mongoose_ObjectId_validation(id) 
            });

            await SessionService.deleteSessions(ids);

        } catch ( error ) {
            return next(error);
        }

        res.locals.message = statusCodes.ok.msg;
        return res.status(statusCodes.ok.code).json({code: statusCodes.ok.code, message: statusCodes.ok.msg});
});


module.exports = router;