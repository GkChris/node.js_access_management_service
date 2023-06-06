const express = require('express');
var router = express.Router();

const config = require('../../config');
const JSONdata= require('../data');
const services = require('../services');
const validations = require('../validations');

const statusCodes = JSONdata.StatusCodes;

const CommonServices = services.CommonServices;
const CommonValidations = validations.CommonValidations;

const RoleService = services.RoleService;


// Module routes
const routes = {
    createRole: '/createRole$',
    updateRole: '/updateRole$',
    deleteRole: '/deleteRole$',
    deleteRoles: '/deleteRoles$',
}

router.route(routes.createRole)
    .post(async(req, res, next) => {

        const name = req.body?.data?.hasOwnProperty('name') ? req.body.data.name : null;
        const description = req.body?.data?.hasOwnProperty('description') ? req.body.data.description : null;
        const realmId = req.body?.data?.hasOwnProperty('realmId') ? req.body.data.realmId : null;
        const clientId = req.body?.data?.hasOwnProperty('clientId') ? req.body.data.clientId : null;
        const permissions = req.body?.data?.hasOwnProperty('permissions') ? req.body.data.permissions : null;

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



router.route(routes.updateRole)
    .post(async(req, res, next) => {

        const id = req.body?.data?.hasOwnProperty('id') ? req.body.data.id : null;
        const payload = req.body?.data?.hasOwnProperty('payload') ? req.body.data.payload : null;

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


router.route(routes.deleteRole)
    .post(async(req, res, next) => {

        const id = req.body?.data?.hasOwnProperty('id') ? req.body.data.id : null;

        try {
            CommonValidations.mongoose_ObjectId_validation(id); // Throws exception if the id is missing. 

            await RoleService.deleteRole(id);

        } catch ( error ) {
            return next(error);
        }

        res.locals.message = statusCodes.ok.msg;
        return res.status(statusCodes.ok.code).json({code: statusCodes.ok.code, message: statusCodes.ok.msg});
});



router.route(routes.deleteRoles)
    .post(async(req, res, next) => {

        const ids = req.body?.data?.hasOwnProperty('ids') ? req.body.data.ids : null;

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


module.exports = router;