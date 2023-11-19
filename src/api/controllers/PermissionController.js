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
const PermissionService = services.PermissionService;

const adminPanelPermissions = config.AuthConfigurations.adminPanelBasicPermissions;

// Module routes
const routes = {
    create: '/create',
    update: '/update/:id',
    delete: '/delete/:id',
    deleteMultiple: '/deleteMultiple',
    fetch: '/fetch/:id?',
}

router.route(routes.create)
    .post(async(req, res, next) => {

        const payload = req.body?.data;
        const auth = req.auth;
        const verifiedReceiver = req.verifiedReceiver;
        
        const name = payload?.name;
        const code = payload?.code;
        const description = payload?.description;

        try {
            if ( !verifiedReceiver ) AuthService.hasPermissions(auth, adminPanelPermissions);
            CommonValidations.is_content_missing({name, code});

            await PermissionService.createPermission(name, code, description);

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

            await PermissionService.updatePermission(id, payload);

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

            await PermissionService.deletePermission(id);

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

            await PermissionService.deletePermissions(ids);

        } catch ( error ) {
            return next(error);
        }

        return res.status(statusCodes.ok.code).json({code: statusCodes.ok.code, message: statusCodes.ok.msg});
});



router.route(routes.fetch)
    .get(async(req, res, next) => {

        const id = req.params?.id;

        const payload = req.query;
        const auth = req.auth;
        const verifiedReceiver = req.verifiedReceiver;
        
        const fields = payload?.fields ? req.query.fields.split(',') : undefined;
        const limit = payload?.limit;
        const offset = payload?.offset;
        let filters = payload?.filters; // {name: "read"}

        if ( filters ) try { filters = JSON.parse(req.query.filters) } catch ( error ) { filters = undefined };

        let permissions;
        let query;

        try {
            if ( !verifiedReceiver ) AuthService.hasPermissions(auth, adminPanelPermissions);

            const options = {
                fields,
                limit,
                offset,
            }     

            if ( id ) query = { _id: id };
            else query = {};

            if ( filters && utils.isPlainObject(filters) ) query = CommonServices.appendFiltersToQuery(query, filters);
            
            permissions = await PermissionService.fetchPermissions(query, options);

        } catch ( error ) {
            return next(error);
        }

        return res.status(statusCodes.ok.code).json({
            code: statusCodes.ok.code, 
            message: statusCodes.ok.msg,
            data: {permissions}
        });
});



module.exports = router;