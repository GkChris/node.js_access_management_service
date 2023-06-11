const express = require('express');
var router = express.Router();

const config = require('../../config');
const JSONdata= require('../data');
const services = require('../services');
const validations = require('../validations');
const utils = require('../utils');

const statusCodes = JSONdata.StatusCodes;

const CommonServices = services.CommonServices;
const CommonValidations = validations.CommonValidations;

const RoleService = services.RoleService;


// Module routes
const routes = {
    create: '/creates',
    update: '/update/:id',
    delete: '/delete/:id',
    deleteMutiple: '/deleteMutiple',
    fetch: '/fetch/:realmId?/:clientId?/:id?',
}

router.route(routes.create)
    .post(async(req, res, next) => {

        const name = req.body?.data?.hasOwnProperty('name') ? req.body.data.name : undefined;
        const description = req.body?.data?.hasOwnProperty('description') ? req.body.data.description : undefined;
        const realmId = req.body?.data?.hasOwnProperty('realmId') ? req.body.data.realmId : undefined;
        const clientId = req.body?.data?.hasOwnProperty('clientId') ? req.body.data.clientId : undefined;
        const permissions = req.body?.data?.hasOwnProperty('permissions') ? req.body.data.permissions : undefined;

        try {
            CommonValidations.is_content_missing({name, realmId, clientId});
            CommonValidations.mongoose_ObjectId_validation(realmId);

            await CommonServices.find_required_references_byId_or_reject([  // {Model: _id}
                {'Realm': realmId},
                {'Client': clientId}
            ])

            await RoleService.createRole({name, description, realmId, clientId, permissions});

        } catch ( error ) {
            return next(error);
        }

        res.locals.message = statusCodes.created.msg;
        return res.status(statusCodes.created.code).json({code: statusCodes.created.code, message: statusCodes.created.msg});
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

            await RoleService.updateRole(id, payload);

        } catch ( error ) {
            return next(error);
        }

        res.locals.message = statusCodes.ok.msg;
        return res.status(statusCodes.ok.code).json({code: statusCodes.ok.code, message: statusCodes.ok.msg});
});


router.route(routes.delete)
    .post(async(req, res, next) => {

        const id = req.params?.id

        try {
            CommonValidations.mongoose_ObjectId_validation(id); // Throws exception if the id is missing. 

            await RoleService.deleteRole(id);

        } catch ( error ) {
            return next(error);
        }

        res.locals.message = statusCodes.ok.msg;
        return res.status(statusCodes.ok.code).json({code: statusCodes.ok.code, message: statusCodes.ok.msg});
});



router.route(routes.deleteMutiple)
    .post(async(req, res, next) => {

        const ids = req.body?.data?.hasOwnProperty('ids') ? req.body.data.ids : undefined;

        try {
            CommonValidations.is_content_missing({ids});
            ids.forEach(id => {
                CommonValidations.mongoose_ObjectId_validation(id) 
            });

            await RoleService.deleteRoles(ids);

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

        let expand = req.query.hasOwnProperty('expand') ? req.query.expand.split(',') : undefined;
        let fields = req.query.hasOwnProperty('fields') ? req.query.fields.split(',') : undefined;
        let limit = req.query.hasOwnProperty('limit') ? req.query.limit : undefined;
        let offset = req.query.hasOwnProperty('offset') ? req.query.offset : undefined;
        let filters = req.query.hasOwnProperty('filters') ? req.query.filters : undefined; // {name: "admin"}

        if ( filters ) try { filters = JSON.parse(req.query.filters) } catch ( error ) { filters = undefined };
        
        let data;
        let query;

        try {
            
            let options = {
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

            data = await RoleService.fetchRoles(query, options);

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