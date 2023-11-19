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

const AuthService = services.AuthService;
const ClientService = services.ClientService;

const adminPanelPermissions = config.AuthConfigurations.adminPanelBasicPermissions;


// Module routes
const routes = {
    create: '/create',
    update: '/update/:id',
    delete: '/delete/:id',
    deleteMultiple: '/deleteMultiple',
    fetch: '/fetch/:realmId?/:id?',
}

router.route(routes.create)
    .post(async(req, res, next) => {

        const payload = req.body?.data;
        const auth = req.auth;
        const verifiedReceiver = req.verifiedReceiver;

        const name = payload?.name;
        const description = payload?.description;
        const realmId = payload?.realmId;

        try {
            if ( !verifiedReceiver ) AuthService.hasPermissions(auth, adminPanelPermissions);
            CommonValidations.is_content_missing({name, realmId});
            CommonValidations.mongoose_ObjectId_validation(realmId);

            await CommonServices.find_required_references_byId_or_reject([  // {Model: _id}
                {'Realm': realmId}
            ])

            await ClientService.createClient({name, description, realmId});

        } catch ( error ) {
            return next(error);
        }

        return res.status(statusCodes.created.code).json({code: statusCodes.created.code, message: statusCodes.created.msg});
});



router.route(routes.update)
    .post(async(req, res, next) => {

        const id = req.params?.id;
        const payload = req.body?.data;
        const auth = req.auth;
        const verifiedReceiver = req.verifiedReceiver;

        try {
            if ( !verifiedReceiver ) AuthService.hasPermissions(auth, adminPanelPermissions);
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

        return res.status(statusCodes.ok.code).json({code: statusCodes.ok.code, message: statusCodes.ok.msg});
});


router.route(routes.delete)
    .post(async(req, res, next) => {

        const id = req.params?.id;
        const auth = req.auth;
        const verifiedReceiver = req.verifiedReceiver;

        try {
            if ( !verifiedReceiver ) AuthService.hasPermissions(auth, adminPanelPermissions);
            CommonValidations.mongoose_ObjectId_validation(id); // Throws exception if the id is missing. 

            await ClientService.deleteClient(id);

        } catch ( error ) {
            return next(error);
        }

        return res.status(statusCodes.ok.code).json({code: statusCodes.ok.code, message: statusCodes.ok.msg});
});



router.route(routes.deleteMultiple)
    .post(async(req, res, next) => {

        const ids = req.body?.data?.ids;
        const auth = req.auth;
        const verifiedReceiver = req.verifiedReceiver;

        try {
            if ( !verifiedReceiver ) AuthService.hasPermissions(auth, adminPanelPermissions);
            CommonValidations.is_content_missing({ids});
            ids.forEach(id => {
                CommonValidations.mongoose_ObjectId_validation(id) 
            });

            await ClientService.deleteClients(ids);

        } catch ( error ) {
            return next(error);
        }

        return res.status(statusCodes.ok.code).json({code: statusCodes.ok.code, message: statusCodes.ok.msg});
});



router.route(routes.fetch)
    .get(async(req, res, next) => {

        const realmId = req.params?.realmId;
        const id = req.params?.id;

        const payload = req.query;
        const auth = req.auth;
        const verifiedReceiver = req.verifiedReceiver;

        const fields = payload.hasOwnProperty('fields') ? payload.fields.split(',') : undefined;
        const expand = payload.hasOwnProperty('expand') ? payload.expand.split(',') : undefined;
        const limit = payload?.limit;
        const offset = payload?.offset;
        let filters = payload?.filters; // {name: "app1"}

        if ( filters ) try { filters = JSON.parse(req.query.filters) } catch ( error ) { filters = undefined };

        let clients;
        let query;

        try {
            if ( !verifiedReceiver ) AuthService.hasPermissions(auth, adminPanelPermissions);
  
            const options = {
                fields,
                expand,
                limit,
                offset, 
            }

            if ( realmId && !id ) query = { realmId }
            else if ( realmId && id ) query = { _id: id, realmId }
            else query = {}

            if ( filters && utils.isPlainObject(filters) ) query = CommonServices.appendFiltersToQuery(query, filters);
            
            clients = await ClientService.fetchClients(query, options);

        } catch ( error ) {
            return next(error);
        }

        return res.status(statusCodes.ok.code).json({
            code: statusCodes.ok.code, 
            message: statusCodes.ok.msg,
            data: {clients}
        });
});


module.exports = router;