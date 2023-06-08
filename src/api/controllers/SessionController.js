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
    create: '/create',
    update: '/update/:id',
    delete: '/delete/:id',
    deleteMultiple: '/deleteMultiple',
    fetch: '/fetch/:realmId?/:clientId?/:userId?/:id?'
}

router.route(routes.create)
    .post(async(req, res, next) => {

        const userId = req.body?.data?.hasOwnProperty('userId') ? req.body.data.userId : null;
        const realmId = req.body?.data?.hasOwnProperty('realmId') ? req.body.data.realmId : null;
        const clientId = req.body?.data?.hasOwnProperty('clientId') ? req.body.data.clientId : null;

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


router.route(routes.update)
    .post(async(req, res, next) => {

        const id = req.params?.id;
        const payload = req.body?.data?.hasOwnProperty('payload') ? req.body.data.payload : undefined;

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


router.route(routes.delete)
    .post(async(req, res, next) => {

        const id = req.params?.id;

        try {
            CommonValidations.mongoose_ObjectId_validation(id); // Throws exception if the id is missing. 

            await SessionService.deleteSession(id);

        } catch ( error ) {
            return next(error);
        }

        res.locals.message = statusCodes.ok.msg;
        return res.status(statusCodes.ok.code).json({code: statusCodes.ok.code, message: statusCodes.ok.msg});
});



router.route(routes.deleteMultiple)
    .post(async(req, res, next) => {

        const ids = req.body?.data?.hasOwnProperty('ids') ? req.body.data.ids : undefined;

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



router.route(routes.fetch)
    .get(async(req, res, next) => {

        const realmId = req.params?.realmId;
        const clientId = req.params?.clientId;
        const userId = req.params?.userId;
        const id = req.params?.id;

        let populate = req.query.hasOwnProperty('populate') ? req.query.populate.split(',') : undefined;
        let limit = req.query.hasOwnProperty('limit') ? req.query.limit : undefined;
        let offset = req.query.hasOwnProperty('offset') ? req.query.offset : undefined;
        // let search = req.query.hasOwnProperty('search') ? req.query.search : undefined;
        
        let data;
        let query;

        try {
            
            let options = {
                populate,
                limit,
                offset,
                // search
            }        

            if ( realmId && clientId && userId && id ) query = { _id: id, realmId, clientId, userId };
            else if ( realmId && clientId && userId ) query = { realmId, clientId, userId };
            else if ( realmId && clientId ) query = { realmId, clientId };
            else if ( realmId ) query = { realmId };
            else query = {};

            data = await SessionService.fetchSessions(query, options);

        } catch ( error ) {
            return next(error);
        }

        res.locals.message = statusCodes.ok.msg;
        return res.status(statusCodes.ok.code).json({
            code: statusCodes.ok.code, 
            message: statusCodes.ok.msg,
            data: data
        });
});



module.exports = router;