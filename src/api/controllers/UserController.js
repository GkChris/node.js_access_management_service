const express = require('express');
var router = express.Router();

const config = require('../../config');
const JSONdata= require('../data');
const services = require('../services');
const validations = require('../validations');
const utils = require('../utils');

const statusCodes = JSONdata.StatusCodes;

const CodeGenerators = utils.CodeGenerators;
const CommonServices = services.CommonServices;
const CommonValidations = validations.CommonValidations;


const UserService = services.UserService;
const SessionService = services.SessionService;


// Module routes
const routes = {
    create: '/create',
    update: '/update/:id',
    delete: '/delete/:id',
    deleteMultiple: '/deleteMultiple',
    fetch: '/fetch/:realmId?/:clientId?/:id?',
    verify: '/verify/:realm?/:client?',
}

router.route(routes.create)
    .post(async(req, res, next) => {

        const payload = req.body?.data;

        const username = payload?.username;
        const firstname = payload?.firstname;
        const lastname = payload?.lastname;
        const email = payload?.email;
        const phone = payload?.phone;
        const phone_code = payload?.phone_code;
        const roleId = payload?.roleId;
        const realmId = payload?.realmId;
        const clientId = payload?.clientId;
        let password = payload?.password;

        try {
            CommonValidations.is_content_missing({
                roleId,
                realmId,
                clientId
            });
            CommonValidations.mongoose_ObjectId_validation(roleId);
            CommonValidations.mongoose_ObjectId_validation(realmId);
            CommonValidations.mongoose_ObjectId_validation(clientId);
           
            await CommonServices.find_required_references_byId_or_reject([  // {Model: _id}
                {'Role': roleId},
                {'Realm': realmId},
                {'Client': clientId}
            ])

            if ( password ) password = await utils.hashPassword(password);
            const sub = CodeGenerators.uuid4_id();

            var user = await UserService.createUser({
                sub,
                password,
                username,
                firstname,
                lastname,
                email, 
                phone,
                phone_code,
                roleId,
                realmId,
                clientId
            });

        } catch ( error ) {
            return next(error);
        }

        res.locals.message = statusCodes.created.msg;
        return res.status(statusCodes.created.code).json({
            code: statusCodes.created.code, 
            message: statusCodes.created.msg,
            data: {user},
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
            if ( payload.roleId ) requiredReferences.push({'Role': payload.roleId});
            if ( payload.realmId ) requiredReferences.push({'Role': payload.realmId});
            if ( payload.clientId ) requiredReferences.push({'Role': payload.clientId});
            if ( requiredReferences.length > 0 ) await CommonServices.find_required_references_byId_or_reject(requiredReferences);


            if ( payload.password ) payload.password = await utils.hashPassword(password);
            await UserService.updateUser(id, payload);

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

            await UserService.deleteUser(id);

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

            await UserService.deleteUsers(ids);

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
        const id = req.params?.id;

        const payload = req.query;

        const expand = payload?.expand ? req.query.expand.split(',') : undefined;
        const fields = payload?.fields ? req.query.fields.split(',') : undefined;
        const limit = payload?.limit;
        const offset = payload?.offset;
        let filters = payload?.filters; // {name: "Chris"}

        if ( filters ) try { filters = JSON.parse(req.query.filters) } catch ( error ) { filters = undefined };

        let data;
        let query;
        
        try {
            
            const options = {
                expand,
                fields,
                limit,
                offset,
            }        

            if ( realmId && clientId && id ) query = { _id: id, realmId, clientId }
            else if ( realmId && clientId && !id ) query = { realmId, clientId }
            else if ( realmId && !clientId ) query = {realmId}
            else query = {};

            if ( filters && utils.isPlainObject(filters) ) query = CommonServices.appendFiltersToQuery(query, filters);
  
            data = await UserService.fetchUsers(query, options);

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


router.route(routes.verify)
    .get(async(req, res, next) => {

        const realm = req.params?.realm;
        const client = req.params?.client;

        const token = req.headers?.token;

        try {
            CommonValidations.is_content_missing({token});

            var {user, session} = utils.validateJwtToken(token);

            if ( realm || client ) await UserService.validateVerifiyReferences(realm, client); 

            await SessionService.validateActiveSession(session);

        } catch ( error ) {
            return next(error);
        }

        res.locals.message = statusCodes.ok.msg;
        return res.status(statusCodes.ok.code).json({
            code: statusCodes.ok.code, 
            message: statusCodes.ok.msg,
            data: {user, session}
        });
});


module.exports = router;