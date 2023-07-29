const express = require('express');
var router = express.Router();

const config = require('../../config');
const JSONdata= require('../data');
const services = require('../services');
const utils = require('../utils');
const validations = require('../validations');

const sessionConfig = config.SessionConfigurations;

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
    fetch: '/fetch/:realmId?/:clientId?/:userId?/:id?',
    refresh: '/refresh' 
}

router.route(routes.create)
    .post(async(req, res, next) => {

        const payload = req.body?.data;

        const userId = payload?.userId;
        const realmId = payload?.realmId;
        const clientId = payload?.clientId;

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

            const user = await UserService.getPopulatedUserById(userId);     // Does not include user's password

            if ( sessionConfig.deleteOldUserSessions ) await SessionService.deleteExpiredSessions(userId, realmId, clientId)

            const session = await SessionService.createSession({userId, realmId, clientId});
        
            const tokenOptions = { maxAge: sessionConfig.sessionAliveMinutes * 60 * 1000 } // Convert minutes to milliseconds
        
            const tokenPayload = {user, session: {_id: session._id}, options: tokenOptions};

            const token = utils.generateJwtToken(tokenPayload, {}); // payload, options

            var responseData = { user, session: {_id: session._id }, options: tokenOptions, token };

        } catch ( error ) {
            return next(error);
        }

        res.locals.message = statusCodes.created.msg;
        return res.status(statusCodes.created.code).json({
            code: statusCodes.created.code, 
            message: statusCodes.created.msg,
            data: responseData,
        });
});


router.route(routes.update)
    .post(async(req, res, next) => {

        const id = req.params?.id;

        const payload = req.body?.data;

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

        const ids = req.body?.data?.ids;

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

        const payload = req.query;

        const expand = payload?.expand ? req.query.expand.split(',') : undefined;
        const fields = payload?.fields ? req.query.fields.split(',') : undefined;
        const limit = payload?.limit;
        const offset = payload?.offset;
        let filters = payload?.filters; // {sub: "some_uuid4"}

        if ( filters ) try { filters = JSON.parse(req.query.filters) } catch ( error ) { filters = undefined };

        let sessions;
        let query;

        try {
            
            const options = {
                expand,
                fields,
                limit,
                offset,
            }        

            if ( realmId && clientId && userId && id ) query = { _id: id, realmId, clientId, userId };
            else if ( realmId && clientId && userId ) query = { realmId, clientId, userId };
            else if ( realmId && clientId ) query = { realmId, clientId };
            else if ( realmId ) query = { realmId };
            else query = {};

            if ( filters && utils.isPlainObject(filters) ) query = CommonServices.appendFiltersToQuery(query, filters);

            sessions = await SessionService.fetchSessions(query, options);

        } catch ( error ) {
            return next(error);
        }

        res.locals.message = statusCodes.ok.msg;
        return res.status(statusCodes.ok.code).json({
            code: statusCodes.ok.code, 
            message: statusCodes.ok.msg,
            data: {sessions}
        });
});


router.route(routes.refresh)
    .post(async(req, res, next) => {

        const token = req.headers?.token;

        try {

            const {user, session, options} = utils.validateJwtToken(token);

            await SessionService.ExtendExpireAtTime(session);

            var responseData = { user, session, options, token };

        } catch ( error ) {
            return next(error);
        }

        res.locals.message = statusCodes.ok.msg;
        return res.status(statusCodes.ok.code).json({
            code: statusCodes.ok.code, 
            message: statusCodes.ok.msg,
            data: responseData,
        });
});



module.exports = router;