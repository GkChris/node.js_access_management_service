const express = require('express');
var router = express.Router();

const config = require('../../config');
const JSONdata= require('../data');
const services = require('../services');
const validations = require('../validations');

const statusCodes = JSONdata.StatusCodes;

const CommonServices = services.CommonServices;
const CommonValidations = validations.CommonValidations;

const PermissionService = services.PermissionService;


// Module routes
const routes = {
    createPermission: '/createPermission$',
    updatePermission: '/updatePermission$',
    deletePermission: '/deletePermission$',
    deletePermissions: '/deletePermissions$',
}

router.route(routes.createPermission)
    .post(async(req, res, next) => {

        const name = req.body?.data?.name ? req.body.data.name : false;
        const code = req.body?.data?.code ? req.body.data.code : false;
        const description = req.body?.data?.description ? req.body.data.description : false;

        try {
            CommonValidations.is_content_missing({name, code});

            await PermissionService.createPermission(name, code, description);

        } catch ( error ) {
            return next(error);
        }

        res.locals.message = statusCodes.created.msg;
        return res.status(statusCodes.created.code).json({code: statusCodes.created.code, message: statusCodes.created.msg});
});


router.route(routes.updatePermission)
    .post(async(req, res, next) => {

        const id = req.body?.data?.id ? req.body.data.id : false;
        const payload = req.body?.data?.payload ? req.body.data.payload : false;

        try {
            CommonValidations.is_content_missing({id, payload});
            CommonValidations.mongoose_ObjectId_validation(id); // Throws exception if the id is missing. 

            await PermissionService.updatePermission(id, payload);

        } catch ( error ) {
            return next(error);
        }

        res.locals.message = statusCodes.ok.msg;
        return res.status(statusCodes.ok.code).json({code: statusCodes.ok.code, message: statusCodes.ok.msg});
});


router.route(routes.deletePermission)
    .post(async(req, res, next) => {

        const id = req.body?.data?.id ? req.body.data.id : false;

        try {
            CommonValidations.mongoose_ObjectId_validation(id); // Throws exception if the id is missing. 

            await PermissionService.deletePermission(id);

        } catch ( error ) {
            return next(error);
        }

        res.locals.message = statusCodes.ok.msg;
        return res.status(statusCodes.ok.code).json({code: statusCodes.ok.code, message: statusCodes.ok.msg});
});



router.route(routes.deletePermissions)
    .post(async(req, res, next) => {

        const ids = req.body?.data?.ids ? req.body.data.ids : false;

        try {
            CommonValidations.is_content_missing({ids});
            ids.forEach(id => {
                CommonValidations.mongoose_ObjectId_validation(id) 
            });

            await PermissionService.deletePermissions(ids);

        } catch ( error ) {
            return next(error);
        }

        res.locals.message = statusCodes.ok.msg;
        return res.status(statusCodes.ok.code).json({code: statusCodes.ok.code, message: statusCodes.ok.msg});
});


module.exports = router;